-- ======== TRIGGERS DA TABELA "servico_realizado" ========

/* TRIGGER DE INSERÇÃO 1
 *  Controla definição de valores cobrados caso não sejam informados durante a inserção do registro.
 *  + OBJETIVOS:
 *      - Inserir "valor_servico" nos registros em que o tipo da cobrança (coluna "tipo_preco" em "servico_oferecido") do serviço que foi realizado for "servico"
 *      - Inserir "valor_total" nos registros automaticamente caso "valor_servico" e "valor_total" seja inseridos como NULL
 * */
DELIMITER $$
CREATE TRIGGER trg_servico_realizado_insert
    BEFORE INSERT
    ON servico_realizado
    FOR EACH ROW
    BEGIN
        DECLARE id_serv INT; /* PK da tabela "servico_oferecido"*/
        DECLARE tipo_p VARCHAR(16); /* Valor da coluna "tipo_preco" */
        DECLARE p DECIMAL(8,2); /* Valor de cobrança do serviço (coluna "preco") */
        DECLARE soma_valor_pet DECIMAL(8,2); /* Valor a ser inserido na coluna "valor_total" 
                                            em "servico_realizado", caso ele deva ser totalizado 
                                            por meio dos "valor_pet" contidos em "pet_servico" 
                                            associado ao serviço realizado */
        
        -- Verificação dos valores a serem inseridos
        IF ISNULL(NEW.valor_servico) AND ISNULL(NEW.valor_total) THEN
            -- Buscando valor e forma de cobrança da tabela "servico_oferecido"
            SELECT 
                preco, tipo_preco 
            INTO p, tipo_p 
            FROM servico_oferecido 
            WHERE id = (SELECT id_servico_oferecido FROM info_servico WHERE id = NEW.id_info_servico);
        
            IF tipo_p = "servico" THEN
                SET NEW.valor_servico = p;
                SET NEW.valor_total = p;
            ELSEIF tipo_p = "pet" THEN
                -- Totalizar o "valor_total" usando valores dos registros associados na tabela "pet_servico"
                SELECT SUM(valor_pet) as soma_valor_pet 
                INTO soma_valor_pet
                FROM pet_servico 
                WHERE 
                    id_info_servico = NEW.id_info_servico
                    AND valor_pet IS NOT NULL 
                GROUP BY id_info_servico;

                SET NEW.valor_total = soma_valor_pet;
            END IF;
        END IF;
    END;$$
DELIMITER ;

/* TRIGGER DE INSERÇÃO 2
 *  Atualiza referência de id_servico_realizado em agendamento quando um novo servico_realizado for inserido
 *  + OBJETIVOS:
 *
 * */
-- DELIMITER $$
-- CREATE TRIGGER trg_servico_realizado_insert_after
--     AFTER INSERT
--     ON servico_realizado
--     FOR EACH ROW
--     BEGIN
--         DECLARE id_agend INT DEFAULT (
--             SELECT id
--             FROM agendamento
--             WHERE
--                 estado = 'concluido'
--                 AND id_info_servico = NEW.id_info_servico
--             LIMIT 1
--         );
--
--         IF (id_agend IS NOT NULL) THEN
--             UPDATE agendamento
--             SET id_servico_realizado = NEW.id
--             WHERE id = id_agend;
--         END IF;
--     END;$$
-- DELIMITER ;
