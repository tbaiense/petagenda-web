-- INSERT
DELIMITER $$
CREATE TRIGGER trg_pet_servico_insert /* Faz a atribuição do valor do preço do pet, se aplicável */
    BEFORE INSERT
    ON pet_servico
    FOR EACH ROW
    BEGIN
        DECLARE tipo_p VARCHAR(16); /*Tipo da cobrança do serviço*/
        DECLARE p DECIMAL(8,2); /* Preço cobrado pelo serviço */

        -- Obtendo informação sobre a forma de cobrança do serviço
        SELECT
            preco, tipo_preco
        INTO
            p, tipo_p
        FROM
            servico_oferecido
        WHERE
            id = (
                SELECT id_servico_oferecido
                FROM info_servico
                WHERE
                    id = NEW.id_info_servico LIMIT 1);

        IF tipo_p = 'pet' THEN
            SET NEW.valor_pet = p;
        ELSE
            SET NEW.valor_pet = NULL;
        END IF;
    END;$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_pet_servico_insert_after
    AFTER INSERT
    ON pet_servico
    FOR EACH ROW
    BEGIN
        DECLARE id_agend INT;
        DECLARE id_serv_real INT;
        DECLARE NEW_valor_total DECIMAL(8,2);
        DECLARE NEW_valor_servico DECIMAL(8,2);

        -- Obtém valores para cobrança do agendamento ou servico_realizado
        IF NEW.id_info_servico IS NOT NULL THEN
            CALL get_valores_info_servico(NEW.id_info_servico, NEW_valor_servico, NEW_valor_total);

            -- Obtendo id do servico_realizado
            SELECT
                id
                INTO id_serv_real
                FROM servico_realizado
                WHERE
                    id_info_servico = NEW.id_info_servico
                LIMIT 1;

            -- Atualizando valores no servico_realizado
            IF id_serv_real IS NOT NULL THEN
                UPDATE servico_realizado
                    SET valor_servico = NEW_valor_servico,
                        valor_total = NEW_valor_total
                    WHERE id = id_serv_real;
            END IF;

            -- Obtendo o id do agendamento
            SELECT
                id
                INTO id_agend
                FROM agendamento
                WHERE
                    id_info_servico = NEW.id_info_servico
                LIMIT 1;

            -- Atualizando valores no agendamento
            IF id_agend IS NOT NULL THEN
                UPDATE agendamento
                SET valor_servico = NEW_valor_servico,
                    valor_total = NEW_valor_total
                WHERE id = id_agend;
            END IF;
        END IF;
    END;$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_pet_servico_update
    AFTER UPDATE
    ON pet_servico
    FOR EACH ROW
    BEGIN
        DECLARE id_agend INT;
        DECLARE id_serv_real INT;
        DECLARE NEW_valor_total DECIMAL(8,2);
        DECLARE NEW_valor_servico DECIMAL(8,2);

        -- Obtém valores atualizados para cobrança do agendamento ou servico_realizado
        IF NEW.id_info_servico IS NOT NULL THEN
            CALL get_valores_info_servico(NEW.id_info_servico, NEW_valor_servico, NEW_valor_total);

            -- Obtendo id do servico_realizado
            SELECT
                id
                INTO id_serv_real
                FROM servico_realizado
                WHERE
                    id_info_servico = NEW.id_info_servico
                LIMIT 1;

            -- Atualizando servico_realizado
            IF id_serv_real IS NOT NULL THEN
                UPDATE servico_realizado
                    SET valor_servico = NEW_valor_servico,
                        valor_total = NEW_valor_total
                    WHERE id = id_serv_real;
            END IF;

            -- Obtendo o id do agendamento
            SELECT
                id
                INTO id_agend
                FROM agendamento
                WHERE
                    id_info_servico = NEW.id_info_servico
                LIMIT 1;

            IF id_agend IS NOT NULL THEN
                UPDATE agendamento
                SET valor_servico = NEW_valor_servico,
                    valor_total = NEW_valor_total
                WHERE id = id_agend;
            END IF;
        END IF;
    END;$$
DELIMITER ;
