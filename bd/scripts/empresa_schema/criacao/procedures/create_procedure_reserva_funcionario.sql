/*
PROCEDIMENTO DE GERENCIAMENTO DE REGISTRO DE RESERVA DE FUNCIONARIO.
TABELA: reserva_funcionario

Formato esperado para JSON objReserva:
- em ação "insert":
    {
        "funcionario": <INT>,  <--- PK da tabela funcionario (coluna id_funcionario em "reserva_funcionario")
        "data": <DATE>,
        "horaInicio": <TIME>,
        "horaFim": <TIME>
    }


- em ação "update":
    {
        "id": <INT>,  <--- id da reserva
        "funcionario": <INT>,  <--- PK da tabela funcionario (coluna id_funcionario em "reserva_funcionario")
        "data": <DATE>,
        "horaInicio": <TIME>,
        "horaFim": <TIME>
    }

- em ação "delete":
    {
        "id": <INT>  <--- id da reserva
    }
*/

DELIMITER $$
CREATE PROCEDURE reserva_funcionario (
    IN acao ENUM('insert', 'update', 'delete'),
    IN objReserva JSON
    )
    COMMENT 'Altera registro de reserva de funcionario de acordo com ações informadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de funcionario
        DECLARE id_reserva INT;
        DECLARE id_func INT;
        DECLARE dt DATE;
        DECLARE hr_ini TIME;
        DECLARE hr_fin TIME;
        DECLARE res_found INT; /* Usado para verificar se reserva existe antes de update ou delete*/

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';

        -- Validação geral
        IF JSON_TYPE(objReserva) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        SET id_reserva = JSON_EXTRACT(objReserva, '$.id');
        SET id_func = JSON_EXTRACT(objReserva, '$.funcionario');
        SET dt = CAST(JSON_UNQUOTE(JSON_EXTRACT(objReserva, '$.data')) AS DATE);
        SET hr_ini = CAST(JSON_UNQUOTE(JSON_EXTRACT(objReserva, '$.horaInicio')) AS TIME);
        SET hr_fin= CAST(JSON_UNQUOTE(JSON_EXTRACT(objReserva, '$.horaFim')) AS TIME);

        -- Processos para inserção de reserva
        IF acao = "insert" THEN
            INSERT INTO reserva_funcionario (
                    id_funcionario, data, hora_inicio, horaFim)
                VALUE (id_func, dt, hr_ini, hr_fin);

        ELSEIF acao IN ("update", "delete") THEN
            IF id_reserva IS NULL THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT ="Nao foi informado id de reserva para acao";
            END IF;

            -- Buscando se existe alguma reserva correspondente já existente
            SELECT id
                INTO res_found
                FROM reserva_funcionario
                WHERE id = id_reserva;

            IF res_found IS NULL THEN
                SIGNAL err_no_for_id_update
                    SET MESSAGE_TEXT = "Nao foi encontrada reserva existente para acao";
            ELSE
                CASE acao
                    WHEN "update" THEN
                        -- Altera registro da reserva
                        UPDATE reserva_funcionario
                        SET
                            data = dt,
                            hora_inicio = hr_ini,
                            hora_fim = hr_fin
                        WHERE id = id_reserva;

                    WHEN "delete" THEN
                        -- Obtendo o id da reserva a ser removida
                        SET id_reserva = JSON_EXTRACT(objReserva, '$.id');

                        -- Altera registro do funcionario
                        DELETE FROM reserva_funcionario WHERE id = id_reserva;
                END CASE;
            END IF;
        END IF;
    END;$$
DELIMITER ;

