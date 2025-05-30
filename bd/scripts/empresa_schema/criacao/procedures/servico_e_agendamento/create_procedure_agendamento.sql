/*
REALIZA PROCESSOS NA TABELA "agendamento" com base nos parâmetros.
TODO: Delegar ações para procedures específicos de cada ação, para simplificar este procedimento.

Formato para "objAgend" para "acao" "insert":
{
    "dtHrMarcada": <DATETIME>,
    "info": {
        "servico": <INT>, <-- PK da tabela servico_oferecido (id_servico_oferecido em "info_servico")
        "funcionario": ?<INT>, <-- id do funcionário atribuído
        "observacoes": ?<VARCHAR(250)>,
        "pets" : [
            +{
                "id": <INT>, <-- PK da tabela pet (id_pet em "pet_servico")
                "alimentacao": ?<TEXT>,
                "remedios": ?[
                    +{"nome": <VARCHAR(128)>, "instrucoes": <TEXT>}
                ]
            }
        ],
        "enderecos": ?[
            +{
                "tipo": <ENUM("buscar", "devolver", "buscar-devolver")>,
                "logradouro": <VARCHAR(128)>,
                "numero": <VARCHAR(16)>,
                "bairro": <VARCHAR(64)>,
                "cidade": <VARCHAR(64)>,
                "estado": ?<CHAR(2)>
            }
        ]
    }
}

Formato para "objAgend" para "acao" "update":
{
    "id": <INT>, <-- id do agendamento
    "dtHrMarcada": <DATETIME>,
    "info": ?{ <-- Não incluir se deverá ser mantido como está
        "servico": <INT>, <-- PK da tabela servico_oferecido (id_servico_oferecido em "info_servico")
        "funcionario": ?<INT> | "", <-- id do funcionário atribuído (deixar "" se deverá ser removido, ou não incluir se deverá ser mantido)
        "observacoes": ?<VARCHAR(250)>, <-- Observações opcionais do registro (não incluir se deverá ser apagado)
        "pets" : ?[ <-- Não incluir se deverá ser mantido como está
            +{
                "id": <INT>, <-- PK da tabela pet (id_pet em "pet_servico")
                "alimentacao": ?<TEXT>, <-- Não incluir se deverá ser mantido como está
                "remedios": ?[ <-- Não incluir se deverá ser mantido como está
                    +{ <-- não inclur se deverá ser apagado
                        "id": <INT>,
                        "nome": ?<VARCHAR(128)>,
                        "instrucoes": ?<TEXT>
                    }
                ]
            }
        ],
        "enderecos": ?[ <-- Não incluir se deverá ser mantido como está
            +{ <-- não inclur se deverá ser apagado
                "tipo": <ENUM("buscar", "devolver", "buscar-devolver")>,
                "logradouro": <VARCHAR(128)>,
                "numero": <VARCHAR(16)>,
                "bairro": <VARCHAR(64)>,
                "cidade": <VARCHAR(64)>,
                "estado": <CHAR(2)>
            }
        ]
    }
}
*/

DELIMITER $$
CREATE PROCEDURE agendamento
    (
        IN acao ENUM("insert", "update"),
        IN objAgend JSON
    )
    COMMENT 'Insere ou modifica o registro de um agendamento e suas tabelas relacionadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de agendamento
        DECLARE id_agend INT;
        DECLARE id_info_serv INT; /* PK da tabela info_servico*/
        DECLARE dt_hr_marc DATETIME;
        DECLARE objInfo JSON;
		DECLARE cadastrarPacote INT;
        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_info_object CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';

        -- Validação geral
        IF JSON_TYPE(objAgend) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        SET dt_hr_marc = CAST(JSON_UNQUOTE(JSON_EXTRACT(objAgend, '$.dtHrMarcada')) AS DATETIME);
        SET objInfo = JSON_EXTRACT(objAgend, '$.info');

        -- Processos para inserção de agendamento
        IF acao = "insert" THEN
            IF ISNULL(objInfo) THEN
                SIGNAL err_no_info_object SET MESSAGE_TEXT = 'Nenhum objeto de info_servico foi informado para insert do servico_realizado';
            END IF;

            SET objInfo = JSON_REMOVE(objInfo, '$.id'); /* Remove para não gerar problemas, pois id aqui é o do servico_realizado, mas no procedimento info_servico() é o do info_servico */
            CALL info_servico('insert', objInfo);
            SET id_info_serv = get_last_insert_info_servico(); /* Recebe o último id de info_servico cadastrado */

            -- Inserção do agendamento
            INSERT INTO agendamento (id_info_servico, dt_hr_marcada) VALUE (id_info_serv, dt_hr_marc);
            
			SET @id_agendamento = LAST_INSERT_ID();            
        ELSEIF acao = "update" THEN
            -- Obtendo o id do agendamento a ser atualizado
            SET id_agend = JSON_EXTRACT(objAgend, '$.id');

            IF ISNULL(id_agend) THEN /* Se id_agendamento não for informado */
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de agendamento para acao update";
            END IF;

            IF (objInfo IS NOT NULL) THEN /* Info_servico foi incluida para ser modificada */
                -- Obtendo FK de info_servico
                SELECT
                    id_info_servico
                INTO id_info_serv
                FROM agendamento
                WHERE
                    id = id_agend;

                IF ISNULL(id_info_serv) THEN
                    SIGNAL err_no_for_id_update SET MESSAGE_TEXT = 'id de agendamento inexistente para update';
                END IF;

                SET objInfo = JSON_INSERT(objInfo, '$.id', id_info_serv);

                CALL info_servico('update', objInfo);
            END IF;

            -- Altera registro do servico_realizad
            UPDATE agendamento SET dt_hr_marcada = dt_hr_marc WHERE id = id_agend;
            
			SET @id_agendamento = id_agend;            
        END IF;
    END;$$
DELIMITER ;

