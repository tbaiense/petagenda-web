DELIMITER $$
CREATE TRIGGER trg_pet_pacote_insert /* Validação semelhante à aplicada à tabela pet_servico */
    BEFORE INSERT
    ON pet_pacote
    FOR EACH ROW
    BEGIN
        -- Variáveis de validação do dono
        DECLARE id_cli_este INT; /* cliente associado a este pet */
        DECLARE id_pet_outro INT; /* id de outro pet associado a este pacote_agend */
        DECLARE id_cli_outro INT; /* cliente associado a outro pet do pacote_agend */

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
                        FROM pacote_agend
                        WHERE id = NEW.id_pacote_agend
                );

        -- Handlers
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET cur_done = TRUE;


        -- Buscando o id de outro pet existe para o mesmo pacote_agend
        SELECT id_pet
            INTO id_pet_outro
            FROM pet_pacote
            WHERE
                id_pacote_agend = NEW.id_pacote_agend
            LIMIT 1;

        -- Validação dos participantes do pacote_agend
        SELECT restricao_participante INTO restr_partic FROM servico_oferecido WHERE id = (
            SELECT id_servico_oferecido FROM pacote_agend WHERE id = NEW.id_pacote_agend
        );

	    -- Obtém as informações do PET sendo inserido
        SELECT id_cliente, id_especie INTO id_cli_este, id_esp_este FROM pet WHERE id = NEW.id_pet;
	    
        IF id_pet_outro IS NOT NULL THEN /* Já existe outro pet para o pacote_agend */

            IF restr_partic = "individual" THEN
                SIGNAL err_qtd_partic_excedido
                    SET MESSAGE_TEXT = "Nao e permitido adicionar pet, pois o servico_oferecido possui restricao individual";
            END IF;
            
            -- Validação se o pet pertence ao mesmo dono
            SELECT id_cliente INTO id_cli_outro FROM pet WHERE id = id_pet_outro;

            IF id_cli_este <> id_cli_outro THEN
                SIGNAL err_dono_diferente
                    SET MESSAGE_TEXT = "Pet nao pode ser inserido, pois pertence a um dono diferente dos que já existem para este pacote_agend";
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
