
/*
REALIZA PROCESSOS NA TABELA "pacote_agend" com base nos parâmetros

Formato esperado para JSON "objPac":
- em "acao" "insert":
{
    "servicoOferecido": <INT>    <--- PK da tabela "servico_oferecido"
    "dtInicio": <DATE>,
    "hrAgendada": <TIME>,
    "frequencia": <ENUM("dias_semana", "dias_mes", "dias_ano")>,
    "qtdRecorrencia": <INT>,
    "diasPacote": [
        +{
            "dia": <INT>
        }
    ],
    "petsPacote" : [
        +{
            "pet": <INT>    <--- PK da tabela "pet"
        }
    ]
}

- em "acao" "update":
{
    "id": <INT>,  <-- PK da tabela "pacote_agend"
    "servicoOferecido": <INT>,    <--- PK da tabela "servico_oferecido"
    "dtInicio": <DATE>,
    "hrAgendada": <TIME>,
    "qtdRecorrencia": <INT>,
    "diasPacote": [   <--- omitir para manter como está
        +{   <-- omitir para remover
            "id": <INT>,    <--- omitir para inserir novo (PK da tabela "dia_pacote")
            "dia": <INT>
        }
    ],
    "petsPacote" : [    <--- omitir para manter como está
        +{   <-- omitir para remover
            "id": <INT>,    <--- omitir para inserir novo (PK da tabela "pet_pacote")
            "pet": <INT>    <--- PK da tabela "pet"
        }
    ]
}

    }
- em ação "delete":
    {
        "id": <INT>  <--- id do pacote_agend
    }
*/

DELIMITER $$
CREATE PROCEDURE pacote_agend (
    IN acao ENUM('insert', 'update', 'delete'),
    IN objPac JSON
    )
    COMMENT 'Altera registro de pacote_agend de acordo com ações informadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de pacote_agend
        DECLARE id_pac INT;
        DECLARE id_serv_ofer INT;
        DECLARE dt_ini DATE;
        DECLARE hr_agend TIME;
        DECLARE freq ENUM("dias_semana", "dias_mes", "dias_ano");
        DECLARE qtd_rec INT;
        DECLARE pac_found INT; /* Usado para verificar se pacote_agend existe antes de update ou delete*/
        -- Infos de dia_pacote
        DECLARE arrayObjDiaPac JSON; /* Array de dia_pacote incluídos */
        DECLARE id_dia_pac INT;
        DECLARE d_length INT; /* quantidade de dia_pacote incluídos no array JSON de "diasPacote"*/
        DECLARE d_count INT;
        DECLARE dia_pac INT;
        DECLARE dia_found INT; /* id_dia_pacote, se encontrado na busca pelo update */
        DECLARE arrayDiaPac JSON;

        -- Infos de pet_pacote
        DECLARE arrayObjPetPac JSON; /* Array de pet_pacote incluídos */
        DECLARE p_length INT; /* quantidade de pet_pacote incluídos no array JSON de "petsPacote"*/
        DECLARE p_count INT;
        DECLARE id_pet_pac INT; /* PK de pet_pacote */
        DECLARE id_pet_cliente INT;  /* PK de tabela "pet" */
        DECLARE pet_found INT; /* id_pet, se encontrado na busca pelo update */
        DECLARE arrayPetPac JSON;

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_info_object CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';
        DECLARE err_not_array CONDITION FOR SQLSTATE '45003';

        -- Validação geral
        IF JSON_TYPE(objPac) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        -- Validaçao dos dias do pacote ("diasPacote")
        SET arrayObjDiaPac = JSON_EXTRACT(objPac, '$.diasPacote');
        IF (arrayObjDiaPac IS NOT NULL) AND JSON_TYPE(arrayObjDiaPac) <> "ARRAY" THEN
            SIGNAL err_not_array SET MESSAGE_TEXT = 'Dias do pacote devem ser nulo ou do tipo Array';
        END IF;

        -- Validaçao dos pets do pacote ("petsPacote")
        SET arrayObjPetPac = JSON_EXTRACT(objPac, '$.petsPacote');
        IF (arrayObjPetPac IS NOT NULL) AND JSON_TYPE(arrayObjPetPac) <> "ARRAY" THEN
            SIGNAL err_not_array SET MESSAGE_TEXT = 'Pets do pacote devem ser nulo ou do tipo Array';
        END IF;

        SET id_serv_ofer = JSON_EXTRACT(objPac, '$.servicoOferecido');
        SET dt_ini = CAST(JSON_UNQUOTE(JSON_EXTRACT(objPac, '$.dtInicio')) AS DATETIME); /* Validação é feita por trigger na tabela "pacote_agend" */
        SET hr_agend = CAST(JSON_UNQUOTE(JSON_EXTRACT(objPac, '$.hrAgendada')) AS TIME);
        SET freq = JSON_UNQUOTE(JSON_EXTRACT(objPac, '$.frequencia'));
        SET qtd_rec = JSON_EXTRACT(objPac, '$.qtdRecorrencia');

        -- Processos para inserção de pacote_agend
        IF acao = "insert" THEN
            -- Inserção do pacote_agend
            INSERT INTO pacote_agend (
                id_servico_oferecido, dt_inicio, hr_agendada, frequencia, qtd_recorrencia)
                VALUE (id_serv_ofer, dt_ini, hr_agend, freq, qtd_rec);
            SET id_pac = LAST_INSERT_ID();

            -- Loop de inserção de dia_pac
            SET d_count = 0;
            SET d_length = JSON_LENGTH(arrayObjDiaPac);

            WHILE d_count < d_length DO
                -- Obtem objeto da array
                SET dia_pac = JSON_EXTRACT(arrayObjDiaPac, CONCAT('$[', d_count, '].dia'));

                INSERT INTO dia_pacote (id_pacote_agend, dia) VALUE (id_pac, dia_pac);

                SET d_count = d_count + 1;
            END WHILE;

            -- Loop de inserção de pet_pacote
            SET p_count = 0;
            SET p_length = JSON_LENGTH(arrayObjPetPac);
            WHILE p_count < p_length DO
                -- Obtem objeto da array
                SET id_pet_cliente = JSON_EXTRACT(arrayObjPetPac, CONCAT('$[', p_count, '].pet'));

                INSERT INTO pet_pacote (id_pacote_agend, id_pet) VALUE (id_pac, id_pet_cliente);

                SET p_count = p_count + 1;
            END WHILE;
			SELECT id_pac AS id_pacote_agendamento;
        ELSEIF acao IN ("update", "delete") THEN
            SET id_pac = JSON_EXTRACT(objPac, '$.id');

            IF id_pac IS NULL THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de pacote_agend para acao";
            END IF;

            -- Buscando se existe algum pacote_agend correspondente já existente
            SELECT id
                INTO pac_found
                FROM pacote_agend
                WHERE id = id_pac;

            IF pac_found IS NULL THEN
                SIGNAL err_no_for_id_update
                    SET MESSAGE_TEXT = "Nao foi encontrado pacote_agend existente para acao";
            ELSE
                CASE acao
                    WHEN "update" THEN
                        UPDATE pacote_agend
                            SET
                                id_servico_oferecido = id_serv_ofer,   /* Implementar trigger que atualiza serviço escolhido nos agendamentos criados */
                                dt_inicio = dt_ini,
                                hr_agendada = hr_agend,   /* Implementar trigger que atualiza serviço escolhido nos agendamentos criados */
                                qtd_recorrencia = qtd_rec  /* Implementar trigger para cancelar ou excluir agendamentos que sobrarem ao diminuir ou adicionar agendamentos ao aumentar */
                            WHERE id = id_pac;

                        -- Loop de atualização de dia_pac
                        SET d_count = 0;
                        SET d_length = JSON_LENGTH(arrayObjDiaPac);
                        IF (arrayObjDiaPac IS NOT NULL) THEN /* Se dias de recorrência deverão ser atualizadas */
                            SET arrayDiaPac = JSON_ARRAY();

                            -- Cria array json com inteiros representando os dias e atualiza os registros dos dias do pacote
                            WHILE d_count < d_length DO
                                -- Obtem objeto da array
                                SET id_dia_pac = JSON_EXTRACT(arrayObjDiaPac, CONCAT('$[', d_count, '].id'));
                                SET dia_pac = JSON_EXTRACT(arrayObjDiaPac, CONCAT('$[', d_count, '].dia'));

                                IF id_dia_pac IS NULL THEN
                                    INSERT INTO dia_pacote (id_pacote_agend, dia) VALUE (id_pac, dia_pac);
                                    SET id_dia_pac = LAST_INSERT_ID();
                                END IF;

                                UPDATE dia_pacote SET dia = dia_pac WHERE id = id_dia_pac;

                                SET arrayDiaPac = JSON_ARRAY_INSERT(arrayDiaPac, '$[0]', id_dia_pac);

                                SET d_count = d_count + 1;
                            END WHILE;

                            -- Apagando dias omitidos da array
                            DELETE FROM dia_pacote
                                WHERE
                                    id_pacote_agend = id_pac
                                    AND (JSON_CONTAINS(arrayDiaPac, id)) IS NOT TRUE;   /* Implementar trigger que cancela agendamentos futuros não preparados */

                        END IF;

                        -- Loop de atualizacao de pet_pacote
                        SET p_count = 0;
                        SET p_length = JSON_LENGTH(arrayObjPetPac);
                        IF (arrayObjPetPac IS NOT NULL) THEN /* Se pets deverão ser atualizadas */
                            SET arrayPetPac = JSON_ARRAY();

                            -- Cria array json com inteiros representando os IDs de tabela "pet_pacote" e atualiza os registros dos pets do pacote
                            WHILE p_count < p_length DO
                                -- Obtem objeto da array
                                SET id_pet_pac = JSON_EXTRACT(arrayObjPetPac, CONCAT('$[', p_count, '].id'));
                                SET id_pet_cliente = JSON_EXTRACT(arrayObjPetPac, CONCAT('$[', p_count, '].pet'));

                                IF id_pet_pac IS NULL THEN
                                    INSERT INTO pet_pacote (id_pacote_agend, id_pet) VALUE (id_pac, id_pet_cliente);
                                    SET id_pet_pac = LAST_INSERT_ID();
                                END IF;

                                UPDATE pet_pacote SET id_pet = id_pet_cliente WHERE id = id_pet_pac;

                                SET arrayPetPac = JSON_ARRAY_INSERT(arrayPetPac, '$[0]', id_pet_pac);

                                SET p_count = p_count + 1;
                            END WHILE;

                            -- Apagando pets omitidos da array
                            DELETE FROM pet_pacote
                                WHERE
                                    id_pacote_agend = id_pac
                                    AND (JSON_CONTAINS(arrayPetPac, id)) IS NOT TRUE;   /* Implementar trigger que cancela agendamentos futuros não preparados */

                        END IF;
                    WHEN "delete" THEN
                        DELETE FROM pacote_agend WHERE id = id_pac; /* refential action nas tabelas dias e pets garantem a exclusão delas */
                END CASE;
            END IF;
        END IF;
    END;$$
DELIMITER ;
