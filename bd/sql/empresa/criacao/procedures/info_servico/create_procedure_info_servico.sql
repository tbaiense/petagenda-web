/*
REALIZA PROCESSOS NA TABELA "info_servico" com base nos parâmetros

Formato para "objServ" para "acao" "insert":
    {
        "servico": <INT>, <-- Id do serviço oferecido pela empresa
        "funcionario": <INT>, <-- Id do funcionário que realizou
        "observacoes": ?<VARCHAR(250)>,
        "pets" : [
            +{
                "id": <INT>, <- id do pet
                "alimentacao": ?<TEXT>,
                "remedios": ?[
                    +{"nome": <VARCHAR(128)>, "instrucoes": <TEXT>}
                ]
            }
        ],
        "enderecos": ?[
            1,2{
                "tipo": <ENUM("buscar", "devolver", "buscar-devolver")>,
                "logradouro": <VARCHAR(128)>,
                "numero":  <VARCHAR(16)>,
                "bairro":  <VARCHAR(64)>,
                "cidade":  <VARCHAR(64)>,
                "estado":  <CHAR(2)>
            }
        ]
    }

Formato para "objServ" para "acao" "update": (NÃO IMPLEMENTADO POR COMPLETO -> NÃO ALTERA PETS E ENDERECOS!!)
    {
        "id": 13, <-- Id do "info_servico" que deverá ser modificado
        "servico": <INT>, <-- Id do serviço oferecido pela empresa
        "funcionario": <INT>, <-- Id do funcionário que realizou
        "observacoes": ?<VARCHAR(250)>,
        "pets" : [
            {
                "id": <INT>, <- id do pet
                "alimentacao": ?<TEXT>,
                "remedios": ?[   <-- omitir se deverá ser mantido como está
                    +{"nome": <VARCHAR(128)>, "instrucoes": <TEXT>}   <-- omitir para REMOVER
                ]
            }
        ],
        "enderecos": [   <-- omitir se deverá ser mantido como está
            1,2{   <-- omitir para REMOVER
                "tipo": <ENUM("buscar", "devolver", "buscar-devolver")>,
                "logradouro": <VARCHAR(128)>,
                "numero":  <VARCHAR(16)>,
                "bairro":  <VARCHAR(64)>,
                "cidade":  <VARCHAR(64)>,
                "estado":  <CHAR(2)>
            }
        ]
    }
*/

DELIMITER $$
CREATE PROCEDURE info_servico
    (
        IN acao ENUM("insert", "update"),
        IN objServ JSON
    )
    COMMENT 'Insere ou modifica o registro de um info_servico e suas tabelas relacionadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de serviço
        DECLARE id_info_serv INT; /* PK da tabela info_servico*/
        DECLARE id_serv_oferec, id_func, enderecos_length INT;
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
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';

        -- Validação geral
        IF JSON_TYPE(objServ) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        -- Obtendo informações para info_servico
        SET id_serv_oferec = JSON_EXTRACT(objServ, '$.servico');
        SET id_func = JSON_EXTRACT(objServ, '$.funcionario');
        SET obs = JSON_UNQUOTE(JSON_EXTRACT(objServ, '$.observacoes'));

        -- Processos para inserção de info_servico
        IF acao = "insert" THEN
            -- Validação para "insert"
            IF JSON_TYPE(JSON_EXTRACT(objServ, '$.pets')) <> 'ARRAY' THEN
                SIGNAL err_no_pets SET MESSAGE_TEXT = 'Pets nao sao array';
            ELSEIF JSON_LENGTH(objServ, '$.pets') = 0 THEN
                SIGNAL err_no_pets SET MESSAGE_TEXT = 'Array de pets nao pode ser vazia';
            END IF;

            -- Insere novo info_servico
            CALL ins_info_servico(id_serv_oferec, id_func, obs);
            SET id_info_serv = get_last_insert_info_servico(); /* Retorna id de último info_servico inserido */

            -- Loop de inserção de pets e remédios
            SET pets_length = JSON_LENGTH(objServ, '$.pets');
            WHILE c_pet < pets_length DO
                -- Obtem objeto da array
                SET pet_obj = JSON_EXTRACT(objServ, CONCAT('$.pets[', c_pet, ']'));

                SET id_pet = JSON_EXTRACT(pet_obj, '$.id');
                SET alimentacao = JSON_UNQUOTE(JSON_EXTRACT(pet_obj, '$.alimentacao'));
                CALL ins_pet_servico(id_pet, id_info_serv, alimentacao);
                SET id_pet_servico = LAST_INSERT_ID();

                -- Loop de inserção de remédios do pet
                SET c_remedio = 0;
                SET remedios_length = JSON_LENGTH(pet_obj, '$.remedios');
                WHILE c_remedio < remedios_length DO
                    SET remedio_obj = JSON_EXTRACT( pet_obj, CONCAT('$.remedios[', c_remedio, ']') );
                    SET nome_rem = JSON_UNQUOTE(JSON_EXTRACT(remedio_obj, '$.nome'));
                    SET instrucoes_rem = JSON_UNQUOTE(JSON_EXTRACT(remedio_obj, '$.instrucoes'));

                    CALL ins_remedio_pet_servico(id_pet_servico, nome_rem, instrucoes_rem);
                    SET c_remedio = c_remedio + 1;
                END WHILE;

                SET c_pet = c_pet + 1;
            END WHILE;

            -- Loop de inserção de endereços (validação é feita por trigger da tabela endereco_info_servico)
            SET endereco_length = JSON_LENGTH(objServ, '$.enderecos');
            WHILE c_endereco < endereco_length DO
                SET end_obj =   JSON_EXTRACT( objServ, CONCAT('$.enderecos[', c_endereco, ']') );

                SET tipo_end = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.tipo'));
                SET logr = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.logradouro'));
                SET num_end = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.numero'));
                SET bairro = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.bairro'));
                SET cid = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.cidade'));
                SET est = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.estado'));

                CALL ins_endereco_info_servico(id_info_serv, tipo_end, logr, num_end, bairro, cid, est);

                SET c_endereco = c_endereco + 1;
            END WHILE;

        ELSEIF acao = "update" THEN
            SET id_info_serv = JSON_EXTRACT(objServ, '$.id');

            IF ISNULL(id_info_serv) THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de info_servico para acao update";
            END IF;

            UPDATE info_servico SET id_servico_oferecido = id_serv_oferec, id_funcionario = id_func, observacoes = obs WHERE id = id_info_serv;

            -- TODO: DELEGAR ALTERAÇÃO DE PETS E ENDEREÇOS PARA PROCEDIMENTOS ESPECÍFICOS
        END IF;
    END;$$
DELIMITER ;

