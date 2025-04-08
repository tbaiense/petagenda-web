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
    nome_bd VARCHAR(32) NOT NULL UNIQUE,
    licenca_empresa ENUM("basico", "profissional"),
    dt_inicio_licenca DATE,
    dt_fim_licenca DATE,
    cota_servico INT NOT NULL DEFAULT 0,
    cota_relatorio_simples INT NOT NULL DEFAULT 0,
    cota_relatorio_detalhado INT NOT NULL DEFAULT 0,
    razao_social VARCHAR(128),
    nome_fantasia VARCHAR(128),
    cnpj CHAR(14) UNIQUE,
    foto TEXT,
    lema VARCHAR(180)
);

CREATE TABLE endereco_empresa (
    id_empresa INT NOT NULL PRIMARY KEY,
    logradouro VARCHAR(128) NOT NULL,
    numero VARCHAR(16) NOT NULL,
    bairro VARCHAR(64) NOT NULL,
    cidade VARCHAR(64) NOT NULL,
    estado CHAR(2) NOT NULL,

    FOREIGN KEY (id_empresa) REFERENCES empresa(id)
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


-- FUNCTIONS ========================================================================================================================================================================



-- TRIGGERS ========================================================================================================================================================================



-- PROCEDURES ================================================================================================================================================================

/*
PROCEDIMENTO DE GERENCIAMENTO DE REGISTRO DE USUARIO.
TABELA: usuario

※ OBS.: empresa deverá ser atribuída por procedimento "set_empresa_usuario"

Formato esperado para JSON objUsuario:
- em ação "insert":
    {
        "email": <VARCHAR(128)>,
        "senha": <VARCHAR(32)>,
        "perguntaSeguranca": ?{
            "pergunta": <VARCHAR(64)>,
            "resposta": <VARCHAR(32)>
        }
    }


- em ação "update":
    {
        "id": <INT>,
        "email": <VARCHAR(128)>,
        "senha": <VARCHAR(32)>,
        "perguntaSeguranca": ?{
            "pergunta": <VARCHAR(64)>,
            "resposta": <VARCHAR(32)>
        }
    }
- em ação "delete":
    {
        "id": <INT>  <--- id do usuario
    }
*/

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


-- EVENTS =============================================================================================================================================



-- FINALIZAÇÃO ========================================================================================================================================
SET foreign_key_checks = ON;
