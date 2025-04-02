DELIMITER $$
CREATE PROCEDURE ins_servico_realizado (IN obj JSON)
    /* Formato para objeto JSON:
        {
            "servico": 1, <-- Id do serviço oferecido pela empresa
            "funcionario": 1, <-- Id do funcionário que realizou
            "inicio": "2025-04-01T08:34:23.388", <-- Data e hora de início da realização do serviço
            "fim": "2025-04-01T10:12:23.388", <-- Data e hora de finalização do serviço
            "observacoes": "", <-- Observações opcionais do registro (deixar null, se não aplicável)
            "pets" : [
                {
                    "id": 1, <- id do pet
                    "alimentacao": "", <- Instruções opcionais de alimentação (deixar null, se não aplicável)
                    "remedios": [{"nome": "", "instrucoes": ""}, {"nome": "", "instrucoes": ""}]  <-- deixar núlo se não aplicável
                }
            ],
            "enderecos": [{"tipo": "devolver", "logradouro": "", "numero": "", "bairro": "", "cidade": "", "estado": ""}] <-- deixar núlo se não aplicável
        }
    */
    COMMENT 'Cadastra um serviço realizado, criando as informações secundárias necessárias (info_servico, pet_servico, etc)'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
		-- Infos de serviço
		DECLARE id_info_servico INT;
		DECLARE id_serv, id_func, enderecos_length INT;
		DECLARE dt_hr_ini, dt_hr_fim DATETIME;
		DECLARE obs  VARCHAR(250);
		-- Info pets
		DECLARE c_pet INT DEFAULT 0;
		DECLARE pet_obj JSON;
		DECLARE pets_length INT;
		DECLARE id_pet INT;
		DECLARE alimentacao  TEXT;
		
		DECLARE c_remedio INT DEFAULT 0;
		DECLARE remedio_obj JSON;
		DECLARE remedios_length INT;
		DECLARE nome_rem VARCHAR(128);
		DECLARE instrucoes_rem TEXT;
		-- Endereços
		DECLARE c_end INT DEFAULT 0;
		DECLARE end_obj JSON;
		DECLARE tipo_end VARCHAR(16);
		DECLARE logr VARCHAR(128);
		DECLARE num_end VARCHAR(16);
		DECLARE bairro VARCHAR(64);
		DECLARE cid VARCHAR(64);
		DECLARE est VARCHAR(2);
	
		-- Condições
		DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
		DECLARE err_no_pets CONDITION FOR SQLSTATE '45001';
		
		-- Validação
		/*
		IF JSON_TYPE(obj) <> "OBJECT" THEN
			SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
		ELSEIF JSON_TYPE(JSON_EXTRACT(obj, '$.servico')) <> 'INTEGER' THEN 
			-- erro servico
		ELSEIF JSON_TYPE(JSON_EXTRACT(obj, '$.funcionario')) <> 'INTEGER' THEN
			-- erro funcionario
		ELSEIF JSON_TYPE(JSON_EXTRACT(obj, '$.inicio')) <> 'DATETIME' THEN
			-- erro data
		ELSEIF JSON_TYPE(JSON_EXTRACT(obj, '$.observacoes')) NOT IN ('STRING', 'NULL') THEN
			-- erro obs
		ELSEIF JSON_TYPE(JSON_EXTRACT(obj, '$.pets')) <> 'ARRAY' THEN
			SIGNAL err_no_pets SET MESSAGE_TEXT = 'Pets nao sao array';
		ELSEIF JSON_LENGTH(obj, '$.pets') = 0 THEN
			SIGNAL err_no_pets SET MESSAGE_TEXT = 'Array de pets nao pode ser vazia';
		ELSEIF JSON_TYPE(obj, '$.enderecos') NOT IN ('ARRAY', 'NULL') THEN
			-- erro enderecos
		END IF;
		*/
		START TRANSACTION;
		-- Cadastro do info_servico
		SET id_serv = JSON_EXTRACT(obj, '$.servico');
		SET id_func = JSON_EXTRACT(obj, '$.funcionario');
		SET obs = JSON_UNQUOTE(JSON_EXTRACT(obj, '$.observacoes'));
		CALL ins_info_servico(id_serv, id_func, obs);
		SET id_info_servico = LAST_INSERT_ID();
		
		SET pets_length = JSON_LENGTH(obj, '$.pets');
		WHILE c_pet < pets_length do
			SET pet_obj = JSON_EXTRACT(obj, CONCAT('$.pets[', c_pet, ']'));
			
			SET id_pet = JSON_EXTRACT(pet_obj, '$.id');
			SET alimentacao = JSON_UNQUOTE(JSON_EXTRACT(pet_obj, '$.alimentacao'));
			CALL ins_pet_servico(id_pet, id_info_servico, alimentacao);
			
			SET c_pet = c_pet + 1;
		END WHILE;
		
		COMMIT;
    END;$$
DELIMITER ;

/* TESTE: 
'{"servico": 1,"funcionario": 1,"observacoes": "observacaoooooooo","pets" : [{"id": 1,"alimentacao": "comida 1"},{"id": 2,"alimentacao": "comida 2"},{"id": 4,"alimentacao": "comida 3"}]}'
*/