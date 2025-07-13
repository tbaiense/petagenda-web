/*
PROCEDIMENTO DE GERENCIAMENTO DE REGISTRO DE SERVIÇO OFERECIDO.
TABELA: servico_oferecido

Formato esperado para JSON objServ:
- em ação "insert":
    {
        "nome": <VARCHAR(64)>,
        "categoria": <INT>,
        "preco": <DECIMAL(8,2)>,
        "tipoPreco": <ENUM("pet", "servico")>,  <-- forma de cobrança do preço
        "descricao": ?<TEXT>,
        "foto": ?<TEXT>,   <-- caminho de arquivo "/caminho/image.png"
        "restricaoParticipante": <ENUM("coletivo", "individual")>,
        "restricaoEspecie": ?[
            +{
                "especie": <INT>  <-- PK da tabela "especie"
            }
        ]
    }


- em ação "update":
    {
        "id": <INT>,  <--- id do servico_oferecido
        "nome": <VARCHAR(64)>,
        "categoria": <INT>,
        "preco": <DECIMAL(8,2)>,
        "tipoPreco": <ENUM("pet", "servico")>,  <-- forma de cobrança do preço
        "descricao": ?<TEXT>,
        "foto": ?<TEXT>,   <-- caminho de arquivo "/caminho/image.png"
        "restricaoParticipante": <ENUM("coletivo", "individual")>,
        "restricaoEspecie": ?[ <-- omitir se deverá ser mantido como está
            +{ <--- não mencionar, se deverá ser apagado
                "especie": <INT>  <-- PK da tabela "especie"
            }
        ]
    }
- em ação "delete":
    {
        "id": <INT>  <--- id do servico_oferecido
    }
*/

DELIMITER $$
CREATE PROCEDURE servico_oferecido (
    IN acao ENUM('insert', 'update', 'delete'),
    IN objServ JSON
    )
    COMMENT 'Altera registro de serviço oferecido de acordo com ações informadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de servico_oferecido
        DECLARE id_serv INT;
        DECLARE nome_serv VARCHAR(64);
        DECLARE id_cat INT;
        DECLARE p DECIMAL(8,2);
        DECLARE tipo_p ENUM("pet", "servico");
        DECLARE desc_serv TEXT;
        DECLARE ft TEXT;
        DECLARE rest_part ENUM("coletivo", "individual");
        DECLARE serv_found INT; /* Usado para verificar se servico existe antes de update ou delete*/
        -- Restricoes de especie
        DECLARE arrayRestEsp JSON;
        DECLARE id_esp INT;
        DECLARE rest_esp_length INT;
        DECLARE rest_esp_count INT;

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_not_array CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';

        -- Validação geral
        IF JSON_TYPE(objServ) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        SET arrayRestEsp = JSON_EXTRACT(objServ, '$.restricaoEspecie');

        IF JSON_TYPE(arrayRestEsp) NOT IN ("ARRAY", NULL) THEN
            SIGNAL err_not_array SET MESSAGE_TEXT = 'Restricoes de especie devem ser Array ou NULL';
        END IF;

        SET nome_serv = JSON_UNQUOTE(JSON_EXTRACT(objServ, '$.nome'));
        SET id_cat = JSON_EXTRACT(objServ, '$.categoria');
        SET p = JSON_EXTRACT(objServ, '$.preco');
        SET tipo_p = JSON_UNQUOTE(JSON_EXTRACT(objServ, '$.tipoPreco'));
        SET desc_serv = JSON_UNQUOTE(JSON_EXTRACT(objServ, '$.descricao'));
        SET ft = JSON_UNQUOTE(JSON_EXTRACT(objServ, '$.foto'));
        SET rest_part = JSON_UNQUOTE(JSON_EXTRACT(objServ, '$.restricaoParticipante'));
        SET rest_esp_length = JSON_LENGTH(arrayRestEsp);

        -- Processos para inserção de servico_oferecido
        IF acao = "insert" THEN
            -- Inserção do serviço oferecido
            INSERT INTO servico_oferecido (
                nome, id_categoria, preco, tipo_preco, descricao, foto, restricao_participante)
                VALUE (nome_serv, id_cat, p, tipo_p, desc_serv, ft, rest_part);
            SET id_serv = LAST_INSERT_ID();

            -- Inserção de restrições de espécie
            IF rest_esp_length > 0 THEN
                SET rest_esp_count = 0;
                WHILE rest_esp_count < rest_esp_length DO
                    SET id_esp = JSON_EXTRACT(arrayRestEsp, CONCAT('$[', rest_esp_count ,'].especie'));

                    -- Verifica id_especie
                    IF id_esp IS NULL THEN
                        SIGNAL err_no_for_id_update
                            SET MESSAGE_TEXT = "E necessario informar um id_especie valido para incluir restricao de especie em servico oferecido";
                    END IF;

                    INSERT INTO restricao_especie (
                        id_servico_oferecido, id_especie)
                        VALUE (id_serv, id_esp);

                    SET rest_esp_count = rest_esp_count + 1;
                END WHILE;
            END IF;
            SELECT id_serv AS id_servico_oferecido;

        ELSEIF acao IN ("update", "delete") THEN
            SET id_serv = JSON_EXTRACT(objServ, '$.id');

            IF id_serv IS NULL THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de servico oferecido para acao";
            END IF;

            -- Buscando se existe algum servico_oferecido correspondente já existente
            SELECT id
                INTO serv_found
                FROM servico_oferecido
                WHERE id = id_serv;

            IF serv_found IS NULL THEN
                SIGNAL err_no_for_id_update
                    SET MESSAGE_TEXT = "Nao foi encontrado servico oferecido existente para acao";
            ELSE
                CASE acao
                    WHEN "update" THEN
                        UPDATE servico_oferecido
                            SET
                                nome = nome_serv,
                                id_categoria = id_cat,
                                preco = p,
                                tipo_preco = tipo_p,
                                descricao = desc_serv,
                                foto = ft,
                                restricao_participante = rest_part
                            WHERE id = id_serv;

                        -- Atualização de restrições de espécie
                        IF arrayRestEsp IS NOT NULL THEN
                            DELETE FROM restricao_especie
                                WHERE id_servico_oferecido = id_serv;

                            -- Loop de inserção de novas restrições de especie
                            IF rest_esp_length > 0 THEN
                                SET rest_esp_count = 0;
                                WHILE rest_esp_count < rest_esp_length DO
                                    SET id_esp = JSON_EXTRACT(arrayRestEsp, CONCAT('$[', rest_esp_count ,'].especie'));

                                    -- Verifica id_especie
                                    IF id_esp IS NULL THEN
                                        SIGNAL err_no_for_id_update
                                            SET MESSAGE_TEXT = "E necessario informar um id_especie valido para incluir restricao de especie em servico oferecido";
                                    END IF;

                                    INSERT INTO restricao_especie (
                                        id_servico_oferecido, id_especie)
                                        VALUE (id_serv, id_esp);

                                    SET rest_esp_count = rest_esp_count + 1;
                                END WHILE;
                            END IF;
                        END IF;
                    WHEN "delete" THEN
                        DELETE FROM restricao_especie WHERE id_servico_oferecido = id_serv;
                        DELETE FROM servico_oferecido WHERE id = id_serv;
                END CASE;
            END IF;
            SELECT id_serv AS id_servico_oferecido;
        END IF;
    END;$$
DELIMITER ;
