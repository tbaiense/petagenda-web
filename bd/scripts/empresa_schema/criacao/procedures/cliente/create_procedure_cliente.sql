/*
PROCEDIMENTO DE GERENCIAMENTO DE REGISTRO DE SERVIÇO OFERECIDO.
TABELA: cliente

Formato esperado para JSON objCliente:
- em ação "insert":
    {
        "nome": <VARCHAR(64)>,
        "telefone": <CHAR(15)>,
        "servicoRequerido": ?[
            +{
                "servico": <INT>  <-- PK da tabela "servico_oferecido"
            }
        ],
        "endereco": {
            "logradouro": <VARCHAR(128)>,
            "numero": <VARCHAR(16)> ,
            "bairro": <VARCHAR(64)>,
            "cidade": <VARCHAR(64)>,
            "estado": <CHAR(2)>     <-- Sigla da unidade federativa (ex: "DF", "ES")
        }
    }


- em ação "update":
    {
        "id": <INT>,  <--- id do cliente
        "nome": <VARCHAR(64)>,
        "telefone": <CHAR(15)>,
        "servicoRequerido": ?[ <-- omitir se deverá ser mantido como está
            +{ <--- não mencionar, se deverá ser apagado
                "servico": <INT>  <-- PK da tabela "servico_oferecido"
            }
        ],
        "endereco": {  <--- omitir para remover
            "logradouro": <VARCHAR(128)>,
            "numero": <VARCHAR(16)> ,
            "bairro": <VARCHAR(64)>,
            "cidade": <VARCHAR(64)>,
            "estado": <CHAR(2)>     <-- Sigla da unidade federativa (ex: "DF", "ES")
        }
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
        -- Endereco
        DECLARE objEnd JSON;
        DECLARE logr VARCHAR(128);
        DECLARE num VARCHAR(16);
        DECLARE bairro_end VARCHAR(64);
        DECLARE cid VARCHAR(64);
        DECLARE est CHAR(2);

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_not_array CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';

        -- Validação geral
        IF JSON_TYPE(objCliente) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        SET arrayServReq = JSON_EXTRACT(objCliente, '$.servicoRequerido');
        -- Validacao dos servicos requeridos
        IF JSON_TYPE(arrayServReq) NOT IN ("ARRAY", NULL) THEN
            SIGNAL err_not_array SET MESSAGE_TEXT = 'Servicos requeridos devem ser Array ou NULL';
        END IF;

        SET nome_cli = JSON_UNQUOTE(JSON_EXTRACT(objCliente, '$.nome'));
        SET tel_cli = JSON_UNQUOTE(JSON_EXTRACT(objCliente, '$.telefone'));
        SET arrayServReq = JSON_UNQUOTE(JSON_EXTRACT(objCliente, '$.servicoRequerido'));
        SET serv_req_length = JSON_LENGTH(arrayServReq);

        SET objEnd = JSON_EXTRACT(objCliente, '$.endereco');

        IF JSON_TYPE(objEnd) NOT IN ("OBJECT", NULL) THEN
            SIGNAL err_not_array SET MESSAGE_TEXT = 'Endereco deve ser Objeto ou NULL';
        END IF;

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

            -- Inserção de endereço do cliente
            IF objEnd IS NOT NULL THEN
                SET logr = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.logradouro'));
                SET num = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.numero'));
                SET bairro_end = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.bairro'));
                SET cid = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.cidade'));
                SET est = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.estado'));

                INSERT INTO endereco_cliente (
                    id_cliente, logradouro, numero, bairro, cidade, estado)
                    VALUES (id_cli, logr, num, bairro_end, cid, est);
            END IF;
            SELECT id_cli AS id_cliente;
        ELSEIF acao IN ("update", "delete") THEN
            SET id_cli = JSON_EXTRACT(objCliente, '$.id');

            IF id_cli IS NULL THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de cliente para acao";
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

                        -- Atualização de endereço do cliente
                        IF objEnd IS NOT NULL THEN
                            SET logr = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.logradouro'));
                            SET num = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.numero'));
                            SET bairro_end = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.bairro'));
                            SET cid = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.cidade'));
                            SET est = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.estado'));

                            UPDATE endereco_cliente
                                SET
                                    logradouro = logr,
                                    numero = num,
                                    bairro = bairro_end,
                                    cidade = cid,
                                    estado = est
                                WHERE id_cliente = id_cli;
                        ELSE
                            DELETE FROM endereco_cliente WHERE id_cliente = id_cli;
                        END IF;
                    WHEN "delete" THEN
                        /* OBS.: deleção do endereço é feito por Referential Action ON DELETE na tabela "endereco_cliente"*/
                        DELETE FROM servico_requerido WHERE id_cliente = id_cli;
                        DELETE FROM cliente WHERE id = id_cli;
                END CASE;
            END IF;
            SELECT id_cli AS id_cliente;
        END IF;
    END;$$
DELIMITER ;