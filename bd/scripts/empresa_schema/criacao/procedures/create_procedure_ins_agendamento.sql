/* EXEMPLO DE USO:
CALL ins_agendamento('{
    "servico": 5,
    "funcionario": 3,
    "data_hora_marcada": "2026-03-04T19:00:00",
    "pacote": 1,
    "observacoes": "obser453",
    "pets" : [
        {
            "id": 1,
            "alimentacao": "comida 1",
            "remedios": [
                {
                    "nome": "remedio 1 pet 1",
                    "instrucoes": "aplicar 1 ao pet 1"
                }
            ]
        },
        {
            "id": 2,
            "alimentacao": "comida 2"
        },
        {
            "id": 4,
            "alimentacao": "comida 3",
            "remedios": [
                {
                    "nome": "remedio 1 pet 3",
                    "instrucoes": "aplicar 1 ao pet 3"
                },
                {
                    "nome": "remedio 2 pet 3",
                    "instrucoes": "aplicar 2 ao pet 3"
                }
            ]
        }
    ],
    "enderecos": [
        {"tipo": "devolver", "logradouro": "Rua A", "numero": "1", "bairro": "Primeiro", "cidade": "I", "estado": "ST"},
        {"tipo": "buscar", "logradouro": "RUA B", "numero": "2", "bairro": "Segundo", "cidade": "II", "estado": "ND"}
    ]
}');
*/

DELIMITER $$
CREATE PROCEDURE ins_agendamento (IN obj JSON)
    /* Formato para objeto JSON:
        {
            "servico": 1, <-- Id do serviço oferecido pela empresa
            "funcionario": 1, <-- Id do funcionário que realizou (null se não aplicável)
            "data_hora_marcada": "2025-04-01T08:00:00", <-- Data e hora prevista para o início da realização do serviço
            "observacoes": "", <-- Observações opcionais do registro (deixar null, se não aplicável)
            "pacote": 29, <-- Id do pacote que o agendamento pertence (null se não aplicável)
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
    COMMENT 'Cadastra um agendamento, criando as informações secundárias necessárias (info_servico, pet_servico, etc)'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de agendamento
        DECLARE id_info_serv INT; /* PK da tabela info_servico*/
        DECLARE id_serv, id_func, enderecos_length, id_pac INT;
        DECLARE dt_hr_marc DATETIME;
        DECLARE obs VARCHAR(250);
        -- Info pets
        DECLARE c_pet INT DEFAULT 0;
        DECLARE pet_obj JSON;
        DECLARE pets_length INT;
        DECLARE id_pet_servico INT; /* PK da tabela pet_servico*/
        DECLARE id_pet INT;
        DECLARE alimentacao  TEXT;
        -- Remedios pet
        DECLARE c_remedio INT DEFAULT 0; /* Variável de contagem do remédio atual da array*/
        DECLARE remedio_obj JSON; /* Objeto remédio da array */
        DECLARE remedios_length INT; /* Tamanho da array remedios*/
        DECLARE nome_rem VARCHAR(128);
        DECLARE instrucoes_rem TEXT;
        -- Endereços
        DECLARE c_endereco INT DEFAULT 0;
        DECLARE endereco_length INT;
        DECLARE end_obj JSON;
        DECLARE tipo_end VARCHAR(16);
        DECLARE logr VARCHAR(128);
        DECLARE num_end VARCHAR(16);
        DECLARE bairro VARCHAR(64);
        DECLARE cid VARCHAR(64);
        DECLARE est CHAR(2);
    
        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_pets CONDITION FOR SQLSTATE '45001';
        
        -- Validação

        IF JSON_TYPE(obj) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        ELSEIF JSON_TYPE(JSON_EXTRACT(obj, '$.pets')) <> 'ARRAY' THEN
            SIGNAL err_no_pets SET MESSAGE_TEXT = 'Pets nao sao array';
        ELSEIF JSON_LENGTH(obj, '$.pets') = 0 THEN
            SIGNAL err_no_pets SET MESSAGE_TEXT = 'Array de pets nao pode ser vazia';
        END IF;

        -- Cadastro do info_servico
        SET id_serv = JSON_EXTRACT(obj, '$.servico');
        SET id_func = JSON_EXTRACT(obj, '$.funcionario');
        SET obs = JSON_UNQUOTE(JSON_EXTRACT(obj, '$.observacoes'));
        CALL ins_info_servico(id_serv, id_func, obs);
        SET id_info_serv = LAST_INSERT_ID();
        
        -- Loop de inserção de pets e remédios
        SET pets_length = JSON_LENGTH(obj, '$.pets');
        WHILE c_pet < pets_length DO
            -- Obtem objeto da array
            SET pet_obj = JSON_EXTRACT(obj, CONCAT('$.pets[', c_pet, ']'));
            
            SET id_pet = JSON_EXTRACT(pet_obj, '$.id');
            SET alimentacao = JSON_UNQUOTE(JSON_EXTRACT(pet_obj, '$.alimentacao'));
            CALL ins_pet_servico(id_pet, id_info_serv, alimentacao);
            SET id_pet_servico = LAST_INSERT_ID();
            
            -- Loop de inserção de remédios do pet
            SET c_remedio = 0;
            SET remedios_length = JSON_LENGTH(pet_obj, '$.remedios');
            WHILE c_remedio < remedios_length DO
                SET remedio_obj = JSON_EXTRACT( pet_obj, CONCAT('$.remedios[', c_remedio, ']') );
                SET nome_rem = JSON_EXTRACT(remedio_obj, '$.nome');
                SET instrucoes_rem = JSON_EXTRACT(remedio_obj, '$.instrucoes');
                
                CALL ins_remedio_pet_servico(id_pet_servico, nome_rem, instrucoes_rem);
                SET c_remedio = c_remedio + 1;
            END WHILE;
        
            SET c_pet = c_pet + 1;
        END WHILE;
        
        -- Loop de inserção de endereços (validação é feita por trigger da tabela endereco_info_servico)
        SET endereco_length = JSON_LENGTH(obj, '$.enderecos');
        WHILE c_endereco < endereco_length DO
            SET end_obj =   JSON_EXTRACT( obj, CONCAT('$.enderecos[', c_endereco, ']') );
        
            SET tipo_end = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.tipo'));
            SET logr = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.logradouro'));
            SET num_end = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.numero'));
            SET bairro = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.bairro'));
            SET cid = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.cidade'));
            SET est = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.estado'));
        
            CALL ins_endereco_info_servico(id_info_serv, tipo_end, logr, num_end, bairro, cid, est);
        
            SET c_endereco = c_endereco + 1;
        END WHILE;
    
        -- Inserção do agendamento
        SET id_pac = JSON_EXTRACT(obj, '$.pacote');
        SET dt_hr_marc = CAST( JSON_UNQUOTE(JSON_EXTRACT(obj, '$.data_hora_marcada')) AS DATETIME );
    
        INSERT INTO agendamento (id_info_servico, dt_hr_marcada, id_pacote_agend) VALUE (id_info_serv, dt_hr_marc, id_pac);
    END;$$
DELIMITER ;

