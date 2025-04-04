/*
PROCEDIMENTO DE GERENCIAMENTO DE REGISTRO DE SERVIÇO OFERECIDO.
TABELA: cliente

Formato esperado para JSON objCliente:
- em ação "insert":
    {
        "nome": <VARCHAR(64)>,
        "telefone": <CHAR(15)>,
        "servico_requerido": ?[
            +{
                "servico": <INT>  <-- PK da tabela "servico_oferecido"
            }
        ]
    }


- em ação "update":
    {
        "id": <INT>,  <--- id do cliente
        "nome": <VARCHAR(64)>,
        "telefone": <CHAR(15)>,
        "servico_requerido": ?[ <-- omitir se deverá ser mantido como está
            +{ <--- não mencionar, se deverá ser apagado
                "servico": <INT>  <-- PK da tabela "servico_oferecido"
            }
        ]
    }
- em ação "delete":
    {
        "id": <INT>  <--- id do cliente
    }
*/

DELIMITER $$
CREATE PROCEDURE cliente (
    IN acao ENUM('insert', 'update', 'delete'),
    IN objCliente JSON
    )
    COMMENT 'Altera registro de cliente de acordo com ações informadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de cliente
        DECLARE id_cli INT;
        DECLARE nome_cli VARCHAR(128);
        DECLARE tel_cli CHAR(15);
        DECLARE cli_found INT; /* Usado para verificar se cliente existe antes de update ou delete*/
        -- Servicos requeridos
        DECLARE arrayServReq JSON;
        DECLARE id_serv INT;
        DECLARE serv_req_length INT;
        DECLARE serv_req_count INT;

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_not_array CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';

        -- Validação geral
        IF JSON_TYPE(objCliente) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        SET arrayServReq = JSON_EXTRACT(objCliente, '$.servico_requerido');

        IF JSON_TYPE(arrayServReq) NOT IN ("ARRAY", NULL) THEN
            SIGNAL err_not_array SET MESSAGE_TEXT = 'Servicos requeridos devem ser Array ou NULL';
        END IF;

        SET nome_cli = JSON_UNQUOTE(JSON_EXTRACT(objCliente, '$.nome'));
        SET tel_cli = JSON_UNQUOTE(JSON_EXTRACT(objCliente, '$.telefone'));
        SET arrayServReq = JSON_UNQUOTE(JSON_EXTRACT(objCliente, '$.servico_requerido'));
        SET serv_req_length = JSON_LENGTH(arrayServReq);

        -- Processos para inserção de cliente
        IF acao = "insert" THEN
            -- Inserção do cliente
            INSERT INTO cliente (
                nome, telefone)
                VALUE (nome_cli, tel_cli);
            SET id_cli = LAST_INSERT_ID();

            -- Inserção de servicos requeridos
            IF serv_req_length > 0 THEN
                SET serv_req_count = 0;
                WHILE serv_req_count < serv_req_length DO
                    SET id_serv = JSON_EXTRACT(arrayServReq, CONCAT('$[', serv_req_count ,'].servico'));

                    -- Verifica id_servico_requerido
                    IF id_serv IS NULL THEN
                        SIGNAL err_no_for_id_update
                            SET MESSAGE_TEXT = "E necessario informar um id_servico_oferecido valido para incluir servico_requerido";
                    END IF;

                    INSERT INTO servico_requerido (
                        id_cliente, id_servico_oferecido)
                        VALUE (id_cli, id_serv);

                    SET serv_req_count = serv_req_count + 1;
                END WHILE;
            END IF;


        ELSEIF acao IN ("update", "delete") THEN
            SET id_cli = JSON_EXTRACT(objCliente, '$.id');

            IF id_cli IS NULL THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de servico oferecido para acao";
            END IF;

            -- Buscando se existe algum cliente correspondente já existente
            SELECT id
                INTO cli_found
                FROM cliente
                WHERE id = id_cli;

            IF cli_found IS NULL THEN
                SIGNAL err_no_for_id_update
                    SET MESSAGE_TEXT = "Nao foi encontrado cliente existente para acao";
            ELSE
                CASE acao
                    WHEN "update" THEN
                        UPDATE cliente
                            SET
                                nome = nome_cli,
                                telefone = tel_cli
                            WHERE id = id_cli;

                        -- Atualização da tabela servico_requerido
                        IF arrayServReq IS NOT NULL THEN
                            DELETE FROM servico_requerido
                                WHERE id_cliente = id_cli;

                            -- Loop de inserção de novos servico_requerido
                            IF serv_req_length > 0 THEN
                                SET serv_req_count = 0;
                                WHILE serv_req_count < serv_req_length DO
                                    SET id_serv = JSON_EXTRACT(arrayServReq, CONCAT('$[', serv_req_count ,'].servico'));

                                    -- Verifica id_servico_requerido
                                    IF id_serv IS NULL THEN
                                        SIGNAL err_no_for_id_update
                                            SET MESSAGE_TEXT = "E necessario informar um id_servico_oferecido valido para incluir servico_requerido do cliente";
                                    END IF;

                                    INSERT INTO servico_requerido (
                                        id_cliente, id_servico_oferecido)
                                        VALUE (id_cli, id_serv);

                                    SET serv_req_count = serv_req_count + 1;
                                END WHILE;
                            END IF;
                        END IF;
                    WHEN "delete" THEN
                        DELETE FROM servico_requerido WHERE id_cliente = id_cli;
                        DELETE FROM cliente WHERE id = id_cli;
                END CASE;
            END IF;
        END IF;
    END;$$
DELIMITER ;



