	/*
PROCEDIMENTO DE GERENCIAMENTO DE REGISTRO DE SERVIÇO OFERECIDO.
TABELA: pet

Formato esperado para JSON objPet:
- em ação "insert":
    {
        "dono": <INT>,   <--- id do dono do pet (PK da tabela "cliente")
        "especie": <INT>, <--- id da espécie do pet (PK da tabela "especie")
        "nome": <VARCHAR(64)>,
        "sexo": <ENUM("M", "F")>,
        "porte": <ENUM("P", "M", "G")>,
        "eCastrado": <ENUM("S", "N")>,   <-- situação de castração do pet
        "estadoSaude": <VARCHAR(32)>,
        "raca": ?<VARCHAR(64)>,
        "cor": ?<VARCHAR(32)>,
        "comportamento": ?<VARCHAR(64)>,    <-- descrição do comportamento
        "cartaoVacina": ?<TEXT>,   <--- caminho para o cartão de vacina no sistema de arquivos ("/caminho/cartao_vacina.pdf")
    }


- em ação "update":
    {
        "id": <INT>, <--- id do pet
        "dono": <INT>,   <--- id do dono do pet (PK da tabela "cliente")
        "especie": <INT>, <--- id da espécie do pet (PK da tabela "especie")
        "nome": <VARCHAR(64)>,
        "sexo": <ENUM("M", "F")>,
        "porte": <ENUM("P", "M", "G")>,
        "eCastrado": <ENUM("S", "N")>,   <-- situação de castração do pet
        "estadoSaude": <VARCHAR(32)>,
        "raca": ?<VARCHAR(64)>,
        "cor": ?<VARCHAR(32)>,
        "comportamento": ?<VARCHAR(64)>,    <-- descrição do comportamento
        "cartaoVacina": ?<TEXT>,   <--- caminho para o cartão de vacina no sistema de arquivos ("/caminho/cartao_vacina.pdf")
    }

- em ação "delete":
    {
        "id": <INT>  <--- id do pet
    }
*/

DELIMITER $$
CREATE PROCEDURE pet (
    IN acao ENUM('insert', 'update', 'delete'),
    IN objPet JSON
    )
    COMMENT 'Altera registro de pet de acordo com ações informadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de pet
        DECLARE id_pet INT;
        DECLARE id_cli INT;
        DECLARE id_esp INT;
        DECLARE nome_pet VARCHAR(64);
        DECLARE sexo_pet ENUM("M", "F");
        DECLARE porte_pet ENUM("P", "M", "G");
        DECLARE e_cast ENUM("S", "N");
        DECLARE est_saude VARCHAR(32);
        DECLARE raca_pet VARCHAR(64);
        DECLARE cor_pet VARCHAR(32);
        DECLARE comp VARCHAR(64);
        DECLARE cart_vac TEXT;
        DECLARE pet_found INT;

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45001';

        -- Validação geral
        IF JSON_TYPE(objPet) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        SET id_cli = JSON_EXTRACT(objPet, '$.dono');
        SET id_esp = JSON_EXTRACT(objPet, '$.especie');
        SET nome_pet = JSON_UNQUOTE(JSON_EXTRACT(objPet, '$.nome'));
        SET sexo_pet = JSON_UNQUOTE(JSON_EXTRACT(objPet, '$.sexo'));
        SET porte_pet = JSON_UNQUOTE(JSON_EXTRACT(objPet, '$.porte'));
        SET e_cast = JSON_UNQUOTE(JSON_EXTRACT(objPet, '$.eCastrado'));
        SET est_saude = JSON_UNQUOTE(JSON_EXTRACT(objPet, '$.estadoSaude'));
        SET raca_pet = JSON_UNQUOTE(JSON_EXTRACT(objPet, '$.raca'));
        SET cor_pet = JSON_UNQUOTE(JSON_EXTRACT(objPet, '$.cor'));
        SET comp = JSON_UNQUOTE(JSON_EXTRACT(objPet, '$.comportamento'));
        SET cart_vac = JSON_UNQUOTE(JSON_EXTRACT(objPet, '$.cartaoVacina'));

        -- Processos para inserção de pet
        IF acao = "insert" THEN
            -- Inserção do pet
            INSERT INTO pet (
                id_cliente, id_especie, nome, sexo, porte, e_castrado, estado_saude, raca, cor, comportamento, cartao_vacina)
                VALUE (id_cli, id_esp, nome_pet, sexo_pet, porte_pet, e_cast, est_saude, raca_pet, cor_pet, comp, cart_vac);
            SET id_pet = LAST_INSERT_ID();
            SELECT id_pet;
        ELSEIF acao IN ("update", "delete") THEN
            SET id_pet = JSON_EXTRACT(objPet, '$.id');

            IF id_pet IS NULL THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de pet para acao";
            END IF;

            -- Buscando se existe algum pet correspondente já existente
            SELECT id
                INTO pet_found
                FROM pet
                WHERE id = id_pet;

            IF pet_found IS NULL THEN
                SIGNAL err_no_for_id_update
                    SET MESSAGE_TEXT = "Nao foi encontrado pet existente para acao";
            ELSE
                CASE acao
                    WHEN "update" THEN
                        UPDATE pet
                            SET
                                id_cliente = id_cli,
                                id_especie = id_esp,
                                nome = nome_pet,
                                sexo = sexo_pet,
                                porte = porte_pet,
                                e_castrado = e_cast,
                                estado_saude = est_saude,
                                raca = raca_pet,
                                cor = cor_pet,
                                comportamento = comp,
                                cartao_vacina = cart_vac
                            WHERE id = id_pet;

                    WHEN "delete" THEN
                        DELETE FROM pet WHERE id = id_pet;
                END CASE;
            END IF;
            SELECT id_pet;
        END IF;
    END;$$
DELIMITER ;