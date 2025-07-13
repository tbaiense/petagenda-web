/*
REALIZA PROCESSOS NA TABELA "servico_realizado" com base nos parâmetros

Formato para "objServ" para "acao" "insert":
{
    "inicio": "2025-04-01T08:34:23.388", <-- Data e hora de início da realização do serviço
    "fim": "2025-04-01T10:12:23.388", <-- Data e hora de finalização do serviço
    "info": {
        "servico": <INT>, <-- id serviço a ser realizado (id_servico_oferecido)
        "funcionario": ?<INT>, <-- id do funcionário atribuído
        "observacoes": ?<VARCHAR(250)>,
        "pets" : [
            +{
                "id": <INT>,
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

Formato para "objServ" para "acao" "update":
    {
        "id": 1, <-- id do serviço realizado
        "inicio": "2025-04-01T08:34:23.388", <-- Data e hora de início da realização do serviço
        "fim": "2025-04-01T10:12:23.388", <-- Data e hora de finalização do serviço
        "info": ?{ <-- Não incluir se deverá ser mantido como está
        "servico": <INT>, <-- id serviço a ser realizado (id_servico_oferecido)
        "funcionario": ?<INT> | "", <-- id do funcionário atribuído (deixar "" se deverá ser removido, ou não incluir se deverá ser mantido)
        "observacoes": ?<VARCHAR(250)>, <-- Observações opcionais do registro (não incluir se deverá ser apagado)
        "pets" : ?[ <-- Não incluir se deverá ser mantido como está
            +{
                "id": <INT>,
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
CREATE PROCEDURE servico_realizado
    (
        IN acao ENUM("insert", "update"),
        IN objServ JSON
    )
    COMMENT 'Insere ou modifica o registro de um servico realizado e suas tabelas relacionadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de serviço
        DECLARE id_serv_real INT; /* PK em "servico_realizado" */
        DECLARE id_info_serv INT; /* PK da tabela info_servico*/
        DECLARE dt_hr_ini, dt_hr_fin DATETIME;
        DECLARE objInfo JSON;

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_info_object CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';

        -- Validação geral
        IF JSON_TYPE(objServ) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        SET dt_hr_ini = CAST( JSON_UNQUOTE(JSON_EXTRACT(objServ, '$.inicio')) AS DATETIME );
        SET dt_hr_fin = CAST( JSON_UNQUOTE(JSON_EXTRACT(objServ, '$.fim')) AS DATETIME );
        SET objInfo = JSON_EXTRACT(objServ, '$.info');

        -- Processos para inserção de servico_realizado
        IF acao = "insert" THEN
            IF ISNULL(objInfo) THEN
                SIGNAL err_no_info_object SET MESSAGE_TEXT = 'Nenhum objeto de info_servico foi informado para insert do servico_realizado';
            END IF;

            SET objInfo = JSON_REMOVE(objInfo, '$.id'); /* Remove para não gerar problemas, pois id aqui é o do servico_realizado, mas no procedimento info_servico() é o do info_servico */
            CALL info_servico('insert', objInfo);
            SET id_info_serv = get_last_insert_info_servico(); /* Recebe o último id de info_servico cadastrado */

            -- Inserção do serviço realizado
            INSERT INTO servico_realizado (id_info_servico, dt_hr_inicio, dt_hr_fim) VALUE (id_info_serv, dt_hr_ini, dt_hr_fin);
            
			SELECT LAST_INSERT_ID() AS id_servico_realizado;

        ELSEIF acao = "update" THEN
            SET id_serv_real = JSON_EXTRACT(objServ, '$.id');

            IF ISNULL(id_serv_real) THEN /* Se id_servico_realizado não for informado */
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de servico_realizado para acao update";
            END IF;

            IF (objInfo IS NOT NULL) THEN /* Info_servico foi incluida para ser modificada */
                -- Obtendo FK de info_servico
                SELECT
                    id_info_servico
                INTO id_info_serv
                FROM servico_realizado
                WHERE
                    id = id_serv_real;

                IF ISNULL(id_info_serv) THEN
                    SIGNAL err_no_for_id_update SET MESSAGE_TEXT = 'id de servico inexistente para update';
                END IF;

                SET objInfo = JSON_INSERT(objInfo, '$.id', id_info_serv);

                CALL info_servico('update', objInfo);
            END IF;

            -- Altera registro do servico_realizad
            UPDATE servico_realizado SET dt_hr_inicio = dt_hr_ini, dt_hr_fim = dt_hr_fin WHERE id = id_serv_real;
            
            SELECT id_serv_real AS id_servico_realizado;
        END IF;
    END;$$
DELIMITER ;


