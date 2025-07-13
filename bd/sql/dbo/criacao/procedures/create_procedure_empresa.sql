/*
PROCEDIMENTO DE GERENCIAMENTO DE REGISTRO DE EMPRESA.
TABELA: empresa

Formato esperado para JSON objEmp:
- em ação "insert":
    {
        "razaoSocial": ?<VARCHAR(128)>,
        "nomeFantasia": <VARCHAR(128)>,
        "cnpj": <CHAR(14)>,
        "foto": ?<TEXT>,
        "lema": ?<VARCHAR(180)>,
        "endereco": ?{  <--- omitir para remover
            "logradouro": <VARCHAR(128)>,
            "numero": <VARCHAR(16)> ,
            "bairro": <VARCHAR(64)>,
            "cidade": <VARCHAR(64)>,
            "estado": <CHAR(2)>     <-- Sigla da unidade federativa (ex: "DF", "ES")
        }
    }

- em ação "update":
    {
        "id": <INT>,  <--- id do empresa
        "razaoSocial": ?<VARCHAR(128)>,
        "nomeFantasia": <VARCHAR(128)>,
        "foto": ?<TEXT>,
        "lema": ?<VARCHAR(180)>,
        "endereco": ?{  <--- omitir para remover
            "logradouro": <VARCHAR(128)>,
            "numero": <VARCHAR(16)> ,
            "bairro": <VARCHAR(64)>,
            "cidade": <VARCHAR(64)>,
            "estado": <CHAR(2)>     <-- Sigla da unidade federativa (ex: "DF", "ES")
        }
    }
- em ação "delete":
    {
        "id": <INT>  <--- id da empresa
    }
*/

DELIMITER $$
CREATE PROCEDURE empresa (
    IN acao ENUM('insert', 'update', 'delete'),
    IN objEmp JSON
    )
    COMMENT 'Altera registro de empresa de acordo com ações informadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de empresa
        DECLARE id_emp INT;
        DECLARE razao_soc VARCHAR(128);
        DECLARE nome_fant VARCHAR(128);
        DECLARE cnpj_emp CHAR(14);
        DECLARE ft TEXT;
        DECLARE lema_emp VARCHAR(180);
        DECLARE emp_found INT; /* Usado para verificar se empresa existe antes de update ou delete*/

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
        IF JSON_TYPE(objEmp) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;


        SET razao_soc = JSON_UNQUOTE(JSON_EXTRACT(objEmp, '$.razaoSocial'));
        SET nome_fant = JSON_UNQUOTE(JSON_EXTRACT(objEmp, '$.nomeFantasia'));
        SET cnpj_emp = JSON_UNQUOTE(JSON_EXTRACT(objEmp, '$.cnpj'));
        SET ft = JSON_UNQUOTE(JSON_EXTRACT(objEmp, '$.foto'));
        SET lema_emp = JSON_UNQUOTE(JSON_EXTRACT(objEmp, '$.lema'));

        SET objEnd = JSON_EXTRACT(objEmp, '$.endereco');

        IF JSON_TYPE(objEnd) NOT IN ("OBJECT", NULL) THEN
            SIGNAL err_not_array SET MESSAGE_TEXT = 'Endereco deve ser Objeto ou NULL';
        END IF;

        -- Processos para inserção de empresa
        IF acao = "insert" THEN
            -- Inserção do empresa
            INSERT INTO empresa (
                nome_fantasia, razao_social, cnpj, foto, lema)
                VALUE (nome_fant, razao_soc, cnpj_emp, ft, lema_emp);
            SET id_emp = LAST_INSERT_ID();
        
            -- Inserção de endereço do empresa
            IF objEnd IS NOT NULL THEN
                SET logr = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.logradouro'));
                SET num = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.numero'));
                SET bairro_end = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.bairro'));
                SET cid = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.cidade'));
                SET est = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.estado'));

                INSERT INTO endereco_empresa (
                    id_empresa, logradouro, numero, bairro, cidade, estado)
                    VALUES (id_emp, logr, num, bairro_end, cid, est);
            END IF;
			SELECT id_emp AS id_empresa;
        ELSEIF acao IN ("update", "delete") THEN
            SET id_emp = JSON_EXTRACT(objEmp, '$.id');

            IF id_emp IS NULL THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de empresa para acao";
            END IF;

            -- Buscando se existe algum empresa correspondente já existente
            SELECT id
                INTO emp_found
                FROM empresa
                WHERE id = id_emp;

            IF emp_found IS NULL THEN
                SIGNAL err_no_for_id_update
                    SET MESSAGE_TEXT = "Nao foi encontrado empresa existente para acao";
            ELSE
                CASE acao
                    WHEN "update" THEN
                        UPDATE empresa
                            SET
                                nome_fantasia = nome_fant,
                                razao_social = razao_soc,
                                foto = ft,
                                lema = lema_emp
                            WHERE id = id_emp;

                        -- Atualização de endereço do empresa
                        IF objEnd IS NOT NULL THEN
                            SET logr = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.logradouro'));
                            SET num = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.numero'));
                            SET bairro_end = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.bairro'));
                            SET cid = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.cidade'));
                            SET est = JSON_UNQUOTE(JSON_EXTRACT(objEnd, '$.estado'));

                            UPDATE endereco_empresa
                                SET
                                    logradouro = logr,
                                    numero = num,
                                    bairro = bairro_end,
                                    cidade = cid,
                                    estado = est
                                WHERE id_empresa = id_emp;
                        ELSE
                            DELETE FROM endereco_empresa WHERE id_empresa = id_emp;
                        END IF;
                    WHEN "delete" THEN
                        /* OBS.: deleção do endereço é feito por Referential Action ON DELETE na tabela "endereco_empresa"*/
                        DELETE FROM empresa WHERE id = id_emp;
                END CASE;
            END IF;
            SELECT id_emp AS id_empresa;
        END IF;
    END;$$
DELIMITER ;




