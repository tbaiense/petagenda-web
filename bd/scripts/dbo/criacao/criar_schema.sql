-- SCHEMA ================================================================================================================================================================
CREATE SCHEMA
    dbo
    CHARACTER SET utf8mb4;

USE dbo;

-- SETUP ================================================================================================================================================================
SET foreign_key_checks = OFF;

-- TABELAS ==============================================================================================================================================================

CREATE TABLE empresa (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome_bd VARCHAR(32) UNIQUE,    /* Gerado automaticamente por trigger */
    licenca_empresa ENUM("basico", "profissional", "corporativo"),  /* Definido por meio de procedimento set_licenca_empresa */
    dt_inicio_licenca DATE,  /* Definido por meio de procedimento set_licenca_empresa */
    dt_fim_licenca DATE,  /* Definido por meio de procedimento set_licenca_empresa */
    cota_servico INT NOT NULL DEFAULT 0,  /* Definido por meio de procedimento set_cotas_empresa */
    cota_relatorio_simples INT NOT NULL DEFAULT 0,  /* Definido por meio de procedimento set_cotas_empresa */
    cota_relatorio_detalhado INT NOT NULL DEFAULT 0,  /* Definido por meio de procedimento set_cotas_empresa */
    razao_social VARCHAR(128),
    nome_fantasia VARCHAR(128),
    cnpj CHAR(14) UNIQUE,   /* TODO: fazer validação por regex */
    foto TEXT,
    lema VARCHAR(180)
);


CREATE TABLE endereco_empresa (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    logradouro VARCHAR(128) NOT NULL,
    numero VARCHAR(16) NOT NULL,
    bairro VARCHAR(64) NOT NULL,
    cidade VARCHAR(64) NOT NULL,
    estado CHAR(2) NOT NULL,

    FOREIGN KEY (id_empresa) REFERENCES empresa(id) ON DELETE CASCADE
);


CREATE TABLE usuario (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_empresa INT,
    email VARCHAR(128) NOT NULL UNIQUE,
    senha VARCHAR(32) NOT NULL,
    e_admin ENUM("Y", "N") NOT NULL DEFAULT "N",
    perg_seg VARCHAR(64),
    resposta_perg_seg VARCHAR(32),

    FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);


-- VIEWS ================================================================================================================================================================

CREATE VIEW vw_empresa AS 
SELECT 
	emp.id AS id,
	emp.nome_bd AS nome_bd,
	emp.licenca_empresa AS licenca_empresa,
	emp.dt_inicio_licenca AS dt_inicio_licenca,
	emp.dt_fim_licenca AS dt_fim_licenca,
	emp.cota_servico AS cota_servico,
	emp.cota_relatorio_simples AS cota_relatorio_simples,
	emp.cota_relatorio_detalhado AS cota_relatorio_detalhado,
	emp.razao_social AS razao_social,
	emp.nome_fantasia AS nome_fantasia,
	emp.cnpj AS cnpj,
	emp.foto AS foto,
	emp.lema AS lema,
	end_emp.id AS id_endereco,
	end_emp.logradouro AS logradouro_endereco,
	end_emp.numero AS numero_endereco,
	end_emp.bairro AS bairro_endereco,
	end_emp.cidade AS cidade_endereco,
	end_emp.estado AS estado_endereco
	
FROM empresa AS emp
	LEFT JOIN endereco_empresa AS end_emp ON (end_emp.id_empresa = emp.id);


-- FUNCTIONS ========================================================================================================================================================================

SET GLOBAL log_bin_trust_function_creators = 1;

DELIMITER $$
CREATE FUNCTION validar_cotas (
    tipo_cota ENUM("servico", "relatorio-simples", "relatorio-detalhado")
    )
    RETURNS INT
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        DECLARE id_emp INT DEFAULT @empresa_atual;
        DECLARE cotas_atual INT;
        DECLARE cotas_apos INT;
        DECLARE licenca_atual ENUM("basico", "profissional", "corporativo");

        DECLARE err_empresa_undefined CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_license CONDITION FOR SQLSTATE '45001';

        IF id_emp IS NULL THEN
            SIGNAL err_empresa_undefined
                SET MESSAGE_TEXT = "A empresa atual nao foi definida para contabilizacao de cotas";
        END IF;

        -- Obtendo licença atual da empresa
        SELECT licenca_empresa INTO licenca_atual FROM empresa WHERE id = id_emp;

        IF licenca_atual IS NULL THEN
            SIGNAL err_no_license
                SET MESSAGE_TEXT = "A empresa nao possui uma licenca ativa para realizar esta acao";
        END IF;

        IF licenca_atual = "corporativo" THEN
            RETURN TRUE;
        ELSEIF licenca_atual IN ("basico", "profissional") THEN
            IF tipo_cota =  "servico" THEN
                IF licenca_atual = "basico" THEN
                    SELECT cota_servico INTO cotas_atual FROM empresa WHERE id = id_emp;
                    -- Verificar quantidade de cotas
                    IF cotas_atual > 0 THEN
                        UPDATE empresa
                            SET cota_servico = cotas_atual - 1
                            WHERE id = id_emp;

                        RETURN TRUE;
                    ELSE
                        RETURN FALSE;
                    END IF;

                ELSE
                    RETURN TRUE;
                END IF;
            ELSEIF tipo_cota = "relatorio-simples" THEN
                -- Verificar quantidade de cotas
                SELECT cota_relatorio_simples INTO cotas_atual FROM empresa WHERE id = id_emp;
                IF cotas_atual > 0 THEN
                    UPDATE empresa
                        SET cota_relatorio_simples = cotas_atual - 1
                        WHERE id = id_emp;

                    RETURN TRUE;
                ELSE
                    RETURN FALSE;
                END IF;

            ELSEIF tipo_cota = "relatorio-detalhado" THEN
                -- Verificar licença
                IF licenca_atual = "profissional" THEN
                    -- Verificar quantidade de cotas
                    SELECT cota_relatorio_detalhado INTO cotas_atual FROM empresa WHERE id = id_emp;
                    IF cotas_atual > 0 THEN
                        UPDATE empresa
                            SET cota_relatorio_detalhado = cotas_atual - 1
                            WHERE id = id_emp;

                        RETURN TRUE;
                    ELSE /* Sem cotas para gerar relatório detalhado */
                        RETURN FALSE;
                    END IF;
                ELSE /* Plano for "basico" */
                    RETURN FALSE;
                END IF;
            END IF;
        END IF;

        RETURN FALSE;
    END;$$
DELIMITER ;



-- TRIGGERS ========================================================================================================================================================================
DELIMITER $$
CREATE TRIGGER trg_empresa_update
    BEFORE UPDATE
    ON empresa
    FOR EACH ROW
    BEGIN
        DECLARE c_servico, c_rel_simples, c_rel_detalhado INT;
        IF OLD.nome_bd IS NULL AND NEW.licenca_empresa IS NOT NULL THEN
            SET NEW.nome_bd = CONCAT("emp_", NEW.id);
        END IF;
        
        IF OLD.licenca_empresa IS NULL OR NEW.licenca_empresa <> OLD.licenca_empresa THEN 
            CASE NEW.licenca_empresa
                WHEN "basico" THEN
                    SET c_servico = 75;
                    SET c_rel_simples = 2;
                    SET c_rel_detalhado = OLD.cota_relatorio_detalhado;
                WHEN "profissional" THEN
                    SET c_servico = OLD.cota_servico;
                    SET c_rel_simples = 12;
                    SET c_rel_detalhado = 8;
                WHEN "corporativo" THEN
                    SET c_servico = OLD.cota_servico;
                    SET c_rel_simples = OLD.cota_relatorio_simples;
                    SET c_rel_detalhado = OLD.cota_relatorio_detalhado;
            END CASE;

            SET NEW.cota_servico = c_servico;
            SET NEW.cota_relatorio_simples = c_rel_simples;
            SET NEW.cota_relatorio_detalhado = c_rel_detalhado;
        END IF;
    END;$$
DELIMITER ;


-- PROCEDURES ================================================================================================================================================================

DELIMITER $$
CREATE PROCEDURE set_empresa_atual(IN id_emp INT)
    DETERMINISTIC
    CONTAINS SQL
    BEGIN
        DECLARE emp_found INT;

        SELECT id INTO emp_found FROM empresa WHERE id = id_emp;

        IF emp_found IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Empresa atual definida nao existente!";
        END IF;
        SET @empresa_atual = id_emp;
    END;$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE usuario (
    IN acao ENUM('insert', 'update', 'delete'),
    IN objUsuario JSON
    )
    COMMENT 'Altera registro de usuario de acordo com ações informadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de usuario
        DECLARE id_u INT;
        DECLARE email_u VARCHAR(128);
        DECLARE senha_u VARCHAR(32);
        DECLARE u_found INT; /* Usado para verificar se usuario existe antes de update ou delete*/

        -- Pergunta de segurança
        DECLARE objPergSeg JSON;
        DECLARE perg VARCHAR(64);
        DECLARE resp VARCHAR(32);

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_not_array CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';
        DECLARE err_no_resp CONDITION FOR SQLSTATE '45003';

        -- Validação geral
        IF JSON_TYPE(objUsuario) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;


        SET email_u = JSON_UNQUOTE(JSON_EXTRACT(objUsuario, '$.email'));
        SET senha_u = JSON_UNQUOTE(JSON_EXTRACT(objUsuario, '$.senha'));

        SET objPergSeg = JSON_EXTRACT(objUsuario, '$.perguntaSeguranca');

        -- Verificação do objeto de pergunta de segurança
        IF objPergSeg IS NOT NULL THEN
            SET perg = JSON_UNQUOTE(JSON_EXTRACT(objPergSeg, '$.pergunta'));
            SET resp = JSON_UNQUOTE(JSON_EXTRACT(objPergSeg, '$.resposta'));

            IF perg IS NULL OR resp IS NULL THEN
                SIGNAL err_no_resp SET MESSAGE_TEXT = "Pergunta ou resposta faltando para objeto JSON perguntaSeguranca";
            END IF;
        END IF;

        IF JSON_TYPE(objPergSeg) NOT IN ("OBJECT", NULL) THEN
            SIGNAL err_not_array SET MESSAGE_TEXT = 'Objeto de pergunta de segurança deve ser Objeto ou NULL';
        END IF;

        -- Processos para inserção de usuario
        IF acao = "insert" THEN
            -- Inserção do usuario
            INSERT INTO usuario (
                email, senha, perg_seg, resposta_perg_seg)
                VALUE (email_u, senha_u, perg, resp);

        ELSEIF acao IN ("update", "delete") THEN
            SET id_u = JSON_EXTRACT(objUsuario, '$.id');

            IF id_u IS NULL THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de usuario para acao";
            END IF;

            -- Buscando se existe algum usuario correspondente já existente
            SELECT id
                INTO u_found
                FROM usuario
                WHERE id = id_u;

            IF u_found IS NULL THEN
                SIGNAL err_no_for_id_update
                    SET MESSAGE_TEXT = "Nao foi encontrado usuario existente para acao";
            ELSE
                CASE acao
                    WHEN "update" THEN
                        UPDATE usuario
                            SET
                                email = email_u,
                                senha = senha_u,
                                perg_seg = perg,
                                resposta_perg_seg = resp
                            WHERE id = id_u;

                    WHEN "delete" THEN
                        DELETE FROM usuario WHERE id = id_u;
                END CASE;
            END IF;
        END IF;
    END;$$
DELIMITER ;


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


DELIMITER $$
CREATE PROCEDURE set_empresa_usuario (
    IN id_emp INT,
    IN id_u INT
    )
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        UPDATE usuario SET id_empresa = id_emp WHERE id = id_u;
    END;$$
DELIMITER ;


-- EVENTS =============================================================================================================================================



-- FINALIZAÇÃO ========================================================================================================================================
SET foreign_key_checks = ON;
