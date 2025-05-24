/*
PROCEDIMENTO DE GERENCIAMENTO DE REGISTRO DE FUNCIONÁRIO.

Formato esperado para JSON ObjFunc:
- em ação "insert":
    {
        "nome": <VARCHAR(64)>,   <--- Nome do funcionário
        "telefone": <CHAR(15)>,  <--- Telefone do funcionário no formato "(27) 99900-8181"
        "exerce": ?[
            +{
                "servico": <INT>  <-- PK da tabela "servico_oferecido" (coluna id_servico_oferecido em "servico_exercido")
            }
        ]
    }


- em ação "update":
    {
        "id": <INT>,   <--- PK de tabela "funcionario"
        "nome": <VARCHAR(64)>,   <--- Nome do funcionário
        "telefone": <CHAR(15)>,  <--- Telefone do funcionário no formato "(27) 99900-8181"
        "exerce": ?[ <--- Não mencionar se deverá ser mantido como está
            +{ <--- Não mencionar se deverá ser excluído de servico_exercido
                "servico": <INT>  <-- PK da tabela "servico_oferecido" (coluna id_servico_oferecido em "servico_exercido")
            }
        ]
    }
*/

DELIMITER $$
CREATE PROCEDURE funcionario (
    IN acao ENUM('insert', 'update'),
    IN objFunc JSON
    )
    COMMENT 'Altera registro de funcionario de acordo com ações informadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de funcionario
        DECLARE id_func INT;
        DECLARE nome_func VARCHAR(64);
        DECLARE tel_func CHAR(15);
        DECLARE arrayServExerc JSON; /* Array de serviços exercidos incluídos */
        DECLARE e_length INT; /* quantidade de serviços exercidos incluídos no array JSON de "exerce"*/
        DECLARE e_count INT;
        DECLARE id_serv INT;

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_info_object CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';
        DECLARE err_not_array CONDITION FOR SQLSTATE '45003';

        -- Validação geral
        IF JSON_TYPE(objFunc) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        -- Validaçao do servico exercido ("exerce")
        SET arrayServExerc = JSON_EXTRACT(objFunc, '$.exerce');
        IF (arrayServExerc IS NOT NULL) AND JSON_TYPE(arrayServExerc) <> "ARRAY" THEN
            SIGNAL err_not_array SET MESSAGE_TEXT = 'Servicos exercidos deve ser nulo ou do tipo Array';
        END IF;

        SET nome_func = JSON_UNQUOTE(JSON_EXTRACT(objFunc, '$.nome'));
        SET tel_func = JSON_UNQUOTE(JSON_EXTRACT(objFunc, '$.telefone'));
        SET e_length = JSON_LENGTH(arrayServExerc); -- NULL se Array não for incluída

        -- Processos para inserção de funcionario
        IF acao = "insert" THEN
            -- Inserção do funcionario
            INSERT INTO funcionario (nome, telefone) VALUE (nome_func, tel_func);
            SET id_func = LAST_INSERT_ID();

            -- Loop de inserção de serviços exercidos
            SET e_count = 0;
            WHILE e_count < e_length DO
                SET id_serv = JSON_EXTRACT(arrayServExerc, CONCAT('$[', e_count ,'].servico'));
                INSERT INTO servico_exercido (id_funcionario, id_servico_oferecido) VALUE (id_func, id_serv);

                SET e_count = e_count + 1;
            END WHILE;
            SELECT id_func AS id_funcionario;

        ELSEIF acao = "update" THEN
            -- Obtendo o id do funcionario a ser atualizado
            SET id_func = JSON_EXTRACT(objFunc, '$.id');

            IF ISNULL(id_func) THEN /* Se id_funcionario não for informado */
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de funcionario para acao update";
            END IF;

            -- Altera registro do funcionario
            UPDATE funcionario SET nome = nome_func, telefone = tel_func WHERE id = id_func;

            -- Atualização de serviços exercidos
            IF e_length IS NOT NULL THEN
                DELETE FROM servico_exercido WHERE id_funcionario = id_func;

                SET e_count = 0;
                WHILE e_count < e_length DO
                    SET id_serv = JSON_EXTRACT(arrayServExerc, CONCAT('$[', e_count ,'].servico'));
                    INSERT INTO servico_exercido (id_funcionario, id_servico_oferecido) VALUE (id_func, id_serv);

                    SET e_count = e_count + 1;
                END WHILE;
            END IF;
        
            SELECT id_func AS id_funcionario;
        END IF;
    END;$$
DELIMITER ;
