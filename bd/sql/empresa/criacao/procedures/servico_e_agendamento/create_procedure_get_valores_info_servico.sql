DELIMITER $$
CREATE PROCEDURE get_valores_info_servico(
        IN NEW_id_info_serv INT,
        INOUT NEW_valor_servico DECIMAL(8,2),
        INOUT NEW_valor_total DECIMAL(8,2)
    )
    BEGIN
        DECLARE tipo_p VARCHAR(16); /* Valor da coluna "tipo_preco" */
        DECLARE p DECIMAL(8,2); /* Valor de cobrança do serviço (coluna "preco") */
        DECLARE valor_pet_total DECIMAL(8,2); /* Valor a ser inserido na coluna "valor_total"
                                            , caso ele deva ser totalizado
                                            por meio dos "valor_pet" contidos em "pet_servico"*/

        DECLARE info_serv_found INT;

        DECLARE err_info_serv_not_found CONDITION FOR SQLSTATE '45001';

        SELECT id INTO info_serv_found FROM info_servico WHERE id = NEW_id_info_serv;

        -- Verifica se id de info_servico existe
        IF info_serv_found IS NULL THEN
            SIGNAL err_info_serv_not_found
                SET MESSAGE_TEXT = "Id de info_servico nao existente";
        END IF;

        SELECT
            preco, tipo_preco
        INTO p, tipo_p
        FROM servico_oferecido
        WHERE id = (SELECT id_servico_oferecido FROM info_servico WHERE id = NEW_id_info_serv);

        IF tipo_p = "servico" THEN
            SET NEW_valor_servico = p;
            SET NEW_valor_total = p;
        ELSEIF tipo_p = "pet" THEN
            -- Totalizar o "valor_total" usando valores dos registros associados na tabela "pet_servico"
            SELECT SUM(valor_pet) as soma_valor_pet
            INTO valor_pet_total
            FROM pet_servico
            WHERE
                id_info_servico = NEW_id_info_serv
                AND valor_pet IS NOT NULL
            GROUP BY id_info_servico;

            SET NEW_valor_servico = NULL;
            SET NEW_valor_total = valor_pet_total;
        END IF;
    END;$$
DELIMITER ;
