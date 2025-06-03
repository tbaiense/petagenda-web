-- ======== TRIGGERS DA TABELA "pet_servico" ========

/* TRIGGER DE INSERÇÃO 1
 *  Controla a definição de valores e valida se pet é compatível com restriçoes
 do servico_oferecido, contido no info_servico relacionado. Se pet for
 incompatível, uma condição de erro será sinalizada.
 *  + OBJETIVOS:
 *      - Calcular o valor para coluna "valor_pet" tendo como base o tipo de
 cobrança do serviço associado;
        - Validar se o pet é compatível com a restrição de espécie aplicada ao
        serviço, se houver;
        - Validar se o pet inserido pertence ao mesmo dono;
        - Validar se o pet pode ser inserido, verificando a quantidade de pets
        já presentes (restrição de participantes);
 * */
DELIMITER $$
CREATE TRIGGER trg_pet_servico_insert
    BEFORE INSERT
    ON pet_servico
    FOR EACH ROW
    BEGIN
        -- Variáveis de definição do valor_pet
        DECLARE tipo_p VARCHAR(16); /*Tipo da cobrança do serviço*/
        DECLARE p DECIMAL(8,2); /* Preço cobrado pelo serviço */

        -- Variáveis de validação do dono
        DECLARE id_cli_este INT; /* cliente associado a este pet */
        DECLARE id_pet_outro INT; /* id de outro pet associado a este info_servico */
        DECLARE id_cli_outro INT; /* cliente associado a outro pet do info_servico*/

        -- Variáveis de validação da espécie
        DECLARE id_ser_ofer INT;
        DECLARE id_esp_este INT;
        DECLARE id_esp_outro INT;
        DECLARE id_esp_cur INT;
        DECLARE cur_done INT DEFAULT FALSE;
        DECLARE serv_tem_restr_esp INT DEFAULT FALSE;
        DECLARE validar_esp INT DEFAULT TRUE;
        DECLARE esp_valida INT DEFAULT FALSE;
        
        -- Variáveis de validação de participantes
        DECLARE restr_partic ENUM("individual", "coletivo");

        -- Condições de erro
        DECLARE err_pet_inexistente CONDITION FOR SQLSTATE '45003';
        DECLARE err_dono_diferente CONDITION FOR SQLSTATE '45000'; /* pet inserido pertence a outro dono */
        DECLARE err_esp_incompativel CONDITION FOR SQLSTATE '45001'; /* espécie do pet é incompatível com as das restrições de espécie aplicadas */
        DECLARE err_qtd_partic_excedido CONDITION FOR SQLSTATE '45002'; /* não é possível adicionar outro pet, devido à restriçao de participantes aplicada  */
        
         -- Cursores
        DECLARE cur_especie CURSOR FOR
            SELECT
                id_especie
                FROM restricao_especie
                WHERE id_servico_oferecido = (
                    SELECT id_servico_oferecido
                        FROM info_servico
                        WHERE id = NEW.id_info_servico
                );

        -- Handlers
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET cur_done = TRUE;
    
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
                WHERE id = NEW.id_info_servico 
        LIMIT 1);
        
        IF tipo_p = 'pet' THEN
            SET NEW.valor_pet = p;
        ELSE
            SET NEW.valor_pet = NULL;
        END IF;
        
        -- Buscando o id de outro pet existe para o mesmo info_servico
        SELECT id_pet
            INTO id_pet_outro
            FROM pet_servico
            WHERE
                id_info_servico = NEW.id_info_servico
            LIMIT 1;

        -- Validação dos participantes do info_servico
        SELECT restricao_participante INTO restr_partic FROM servico_oferecido WHERE id = (
            SELECT id_servico_oferecido FROM info_servico WHERE id = NEW.id_info_servico
        );

        -- Obtém as informações do PET sendo inserido
        SELECT id_cliente, id_especie INTO id_cli_este, id_esp_este FROM pet WHERE id = NEW.id_pet;
        
        IF id_esp_este IS NULL THEN
            SIGNAL err_pet_inexistente SET MESSAGE_TEXT = "Não foi possível verificar a espécie de um dos pets inserido";
        END IF;
    
        IF id_pet_outro IS NOT NULL THEN /* Já existe outro pet para o info_servico */

            IF restr_partic = "individual" THEN
                SIGNAL err_qtd_partic_excedido
                    SET MESSAGE_TEXT = "Nao e permitido adicionar pet, pois o servico_oferecido possui restricao individual";
            END IF;
            
            -- Validação se o pet pertence ao mesmo dono
            SELECT id_cliente INTO id_cli_outro FROM pet WHERE id = id_pet_outro;
            
            IF id_cli_este <> id_cli_outro THEN
                SIGNAL err_dono_diferente
                    SET MESSAGE_TEXT = "Pet nao pode ser inserido, pois pertence a um dono diferente dos que já existem para este info_servico";
            END IF;

            SELECT id_especie INTO id_esp_outro FROM pet WHERE id = id_pet_outro LIMIT 1;
            
            IF id_esp_este = id_esp_outro THEN
                SET validar_esp = FALSE;
            END IF;
        END IF;

        -- Validação da espécie do pet
        IF validar_esp IS TRUE THEN
            OPEN cur_especie;
            especie_loop: LOOP
                FETCH cur_especie INTO id_esp_cur;
                
                IF id_esp_cur IS NOT NULL THEN
                    SET serv_tem_restr_esp = TRUE;
                
                    IF id_esp_cur = id_esp_este THEN
                        SET esp_valida = TRUE;
                        LEAVE especie_loop;
                    END IF;
                END IF;
                
                IF cur_done THEN
                    LEAVE especie_loop;
                END IF;
                
            END LOOP;
            CLOSE cur_especie;
            
            IF serv_tem_restr_esp IS TRUE AND esp_valida IS FALSE THEN
                SIGNAL err_esp_incompativel
                    SET MESSAGE_TEXT = "Especie do pet inserido e incompativel com restricoes de especie do servico_oferecido";
            END IF;
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
