/*
PROCEDIMENTO DE GERENCIAMENTO DE REGISTRO DE INCIDENTE.
TABELA: incidente

Formato esperado para JSON objIncidente:
- em ação "insert":
    {
        "servicoRealizado": <INT>,  <-- PK da tabela "servico_realizado"
        "tipo": <ENUM("emergencia-medica", "briga", "mau-comportamento", "agressao")>,
        "dtHrOcorrido": <DATETIME>,
        "relato": <TEXT>,
        "medidaTomada": ?<TEXT>
    }


- em ação "update":
    {
        "id": <INT>,  <--- id do incidente
        "servicoRealizado": <INT>,  <-- PK da tabela "servico_realizado"
        "tipo": <ENUM("emergencia-medica", "briga", "mau-comportamento", "agressao")>,
        "dtHrOcorrido": <DATETIME>,
        "relato": <TEXT>,
        "medidaTomada": ?<TEXT>   <--- omitir para remover
    }
- em ação "delete":
    {
        "id": <INT>  <--- id do incidente
    }
*/

DELIMITER $$
CREATE PROCEDURE incidente (
    IN acao ENUM('insert', 'update', 'delete'),
    IN objInc JSON
    )
    COMMENT 'Altera registro de incidente de acordo com ações informadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de incidente
        DECLARE id_inc INT;
        DECLARE id_serv_real INT;
        DECLARE tipo_inc ENUM("emergencia-medica", "briga", "mau-comportamento", "agressao");
        DECLARE dt_hr_ocorr DATETIME;
        DECLARE rel TEXT;
        DECLARE med_tom TEXT;
        DECLARE inc_found INT; /* Usado para verificar se incidente existe antes de update ou delete*/

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_not_array CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';

        -- Validação geral
        IF JSON_TYPE(objInc) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        SET id_serv_real = JSON_EXTRACT(objInc, '$.servicoRealizado');
        SET tipo_inc = JSON_UNQUOTE(JSON_EXTRACT(objInc, '$.tipo'));
        SET dt_hr_ocorr = CAST(JSON_UNQUOTE(JSON_EXTRACT(objInc, '$.dtHrOcorrido')) AS DATETIME); /* Validação é feita por trigger na tabela "incidente" */
        SET rel = JSON_UNQUOTE(JSON_EXTRACT(objInc, '$.relato'));
        SET med_tom = JSON_UNQUOTE(JSON_EXTRACT(objInc, '$.medidaTomada'));

        -- Processos para inserção de incidente
        IF acao = "insert" THEN
            -- Inserção do incidente
            INSERT INTO incidente (
                id_servico_realizado, tipo, dt_hr_ocorrido, relato, medida_tomada)
                VALUE (id_serv_real, tipo_inc, dt_hr_ocorr, rel, med_tom);
            SET id_inc = LAST_INSERT_ID();
			SELECT id_inc AS id_incidente;
        ELSEIF acao IN ("update", "delete") THEN
            SET id_inc = JSON_EXTRACT(objInc, '$.id');

            IF id_inc IS NULL THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de incidente para acao";
            END IF;

            -- Buscando se existe algum incidente correspondente já existente
            SELECT id
                INTO inc_found
                FROM incidente
                WHERE id = id_inc;

            IF inc_found IS NULL THEN
                SIGNAL err_no_for_id_update
                    SET MESSAGE_TEXT = "Nao foi encontrado incidente existente para acao";
            ELSE
                CASE acao
                    WHEN "update" THEN
                        UPDATE incidente
                            SET
                                id_servico_realizado = id_serv_real,
                                tipo = tipo_inc,
                                dt_hr_ocorrido = dt_hr_ocorr,
                                relato = rel,
                                medida_tomada = med_tom
                            WHERE id = id_inc;
            
						SELECT id_inc AS id_incidente;
                    WHEN "delete" THEN
                        DELETE FROM incidente WHERE id = id_inc;
                END CASE;
            END IF;
        END IF;
    END;$$
DELIMITER ;






