-- DATA DE ATUALIZAÇÃO: 28/06/2025

-- SCHEMA ================================================================================================================================================================
-- CREATE SCHEMA
--    emp_?
--    CHARACTER SET utf8mb4;
--
-- USE emp_?;

-- SETUP ================================================================================================================================================================
SET foreign_key_checks = OFF;
-- SET GLOBAL sql_mode  = 'TRADITIONAL';

-- TABELAS ==============================================================================================================================================================

CREATE TABLE funcionario (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(64) NOT NULL,
    telefone CHAR(15) NOT NULL
);

CREATE TABLE reserva_funcionario(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_funcionario INT NOT NULL,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,

    UNIQUE (id_funcionario, data, hora_inicio),
    UNIQUE (id_funcionario, data, hora_fim),
    CONSTRAINT chk_reserva_funcionario_hora_inicio_AND_hora_fim CHECK (hora_inicio < hora_fim),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id)
);


CREATE TABLE categoria_servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(24) NOT NULL
);

CREATE TABLE servico_oferecido (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(64) NOT NULL,
    preco DECIMAL(8,2) NOT NULL DEFAULT 0,
    tipo_preco ENUM("pet", "servico") NOT NULL DEFAULT "pet",
    id_categoria INT NOT NULL,
    descricao TEXT,
    foto TEXT,
    restricao_participante ENUM("coletivo", "individual") NOT NULL DEFAULT "coletivo",

    CONSTRAINT chk_servico_oferecido_preco CHECK (preco >= 0),
    FOREIGN KEY (id_categoria) REFERENCES categoria_servico(id)
);

CREATE TABLE servico_exercido (
    id_funcionario INT NOT NULL,
    id_servico_oferecido INT NOT NULL,

    PRIMARY KEY (id_funcionario, id_servico_oferecido),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id),
    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id)
);

CREATE TABLE especie (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(64) NOT NULL
);

CREATE TABLE restricao_especie (
    id_servico_oferecido INT NOT NULL,
    id_especie INT NOT NULL,

    PRIMARY KEY (id_servico_oferecido, id_especie),
    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id),
    FOREIGN KEY (id_especie) REFERENCES especie(id)
);

CREATE TABLE cliente (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(128) NOT NULL,
    telefone CHAR(15) NOT NULL
);

CREATE TABLE endereco_cliente (
    id_cliente INT NOT NULL PRIMARY KEY,
    logradouro VARCHAR(128) NOT NULL,
    numero VARCHAR(16) NOT NULL,
    bairro VARCHAR(64) NOT NULL,
    cidade VARCHAR(64) NOT NULL,
    estado CHAR(2) NOT NULL DEFAULT "ES",

    FOREIGN KEY (id_cliente) REFERENCES cliente(id) ON DELETE CASCADE
);


CREATE TABLE servico_requerido (
    id_cliente INT NOT NULL,
    id_servico_oferecido INT NOT NULL,

    PRIMARY KEY (id_cliente, id_servico_oferecido),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id)
);

CREATE TABLE pet (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT,
    id_especie INT NOT NULL,
    nome VARCHAR(64) NOT NULL,
    raca VARCHAR(64),
    porte ENUM("P", "M", "G") NOT NULL,
    cor VARCHAR(32),
    sexo ENUM("M", "F") NOT NULL,
    e_castrado ENUM("S", "N") NOT NULL DEFAULT "N",
    cartao_vacina TEXT,
    estado_saude VARCHAR(32),
    comportamento VARCHAR(64),

    FOREIGN KEY (id_cliente) REFERENCES cliente(id) ON DELETE SET NULL,
    FOREIGN KEY (id_especie) REFERENCES especie(id)
);


CREATE TABLE info_servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_servico_oferecido INT NOT NULL,
    id_funcionario INT,
    id_cliente INT,
    observacoes VARCHAR(250),

    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id)
);



CREATE TABLE pet_servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_pet INT NOT NULL,
    id_info_servico INT NOT NULL,
    instrucao_alimentacao TEXT,
    valor_pet DECIMAL(8,2),

    CONSTRAINT chk_pet_servico_valor_pet CHECK (valor_pet >= 0),
    UNIQUE (id_pet, id_info_servico),
    FOREIGN KEY (id_pet) REFERENCES pet(id),
    FOREIGN KEY (id_info_servico) REFERENCES info_servico(id)
);



CREATE TABLE remedio_pet_servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_pet_servico INT NOT NULL,
    nome VARCHAR(128) NOT NULL,
    instrucoes TEXT NOT NULL,

    UNIQUE (id_pet_servico, nome),
    FOREIGN KEY (id_pet_servico) REFERENCES pet_servico(id)
);


CREATE TABLE endereco_info_servico (
    id_info_servico INT NOT NULL,
    tipo ENUM("buscar", "devolver", "buscar-devolver") NOT NULL,
    logradouro VARCHAR(128) NOT NULL,
    numero VARCHAR(16) NOT NULL,
    bairro VARCHAR(64) NOT NULL,
    cidade VARCHAR(64) NOT NULL,
    estado CHAR(2) NOT NULL DEFAULT "ES",

    UNIQUE (id_info_servico, tipo),
    PRIMARY KEY (id_info_servico, tipo),
    FOREIGN KEY (id_info_servico) REFERENCES info_servico(id)
);


CREATE TABLE pacote_agend (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_servico_oferecido INT NOT NULL,
    dt_inicio DATE NOT NULL,
    hr_agendada TIME NOT NULL,
    frequencia ENUM("dias_semana", "dias_mes", "dias_ano") NOT NULL,
    estado ENUM("criado", "preparado", "ativo", "concluido", "cancelado") NOT NULL DEFAULT "criado",
    qtd_recorrencia INT NOT NULL,

    CONSTRAINT chk_pacote_agend_qtd_recorrencia CHECK (qtd_recorrencia > 0),
    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id)
);


CREATE TABLE pet_pacote (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_pacote_agend INT NOT NULL,
    id_pet INT NOT NULL,

    UNIQUE (id_pacote_agend, id_pet),
    FOREIGN KEY (id_pacote_agend) REFERENCES pacote_agend(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pet) REFERENCES pet(id)
);



CREATE TABLE dia_pacote (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_pacote_agend INT NOT NULL,
    dia INT NOT NULL,

    UNIQUE (id_pacote_agend, dia),
    FOREIGN KEY (id_pacote_agend) REFERENCES pacote_agend(id) ON DELETE CASCADE
);


CREATE TABLE servico_realizado (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_info_servico INT NOT NULL UNIQUE,
    dt_hr_fim DATETIME NOT NULL,
    dt_hr_inicio DATETIME,
    valor_servico DECIMAL(8,2),
    valor_total DECIMAL(8,2),

    CONSTRAINT chk_servico_realizado_valor_servico CHECK (valor_servico >= 0),
    CONSTRAINT chk_servico_realizado_valor_total CHECK (valor_total >= 0),
    CONSTRAINT chk_servico_realizado_dt_hr_fim_AND_dt_hr_inicio CHECK (dt_hr_fim > dt_hr_inicio),
    FOREIGN KEY (id_info_servico) REFERENCES info_servico(id)
);

CREATE TABLE incidente (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_servico_realizado INT NOT NULL,
    tipo ENUM("emergencia-medica", "briga", "mau-comportamento", "agressao") NOT NULL,
    dt_hr_ocorrido DATETIME NOT NULL,
    relato TEXT NOT NULL,
    medida_tomada TEXT,

    FOREIGN KEY (id_servico_realizado) REFERENCES servico_realizado(id)
);

CREATE TABLE agendamento (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_info_servico INT NOT NULL UNIQUE,
    dt_hr_marcada DATETIME NOT NULL,
    estado ENUM("criado", "preparado", "pendente", "concluido", "cancelado") NOT NULL,
    id_pacote_agend INT,
    id_servico_realizado INT UNIQUE,
    valor_servico DECIMAL(8,2),
    valor_total DECIMAL(8,2),

    CONSTRAINT chk_agendamento_valor_servico CHECK (valor_servico >= 0),
    CONSTRAINT chk_agendamento_valor_total CHECK (valor_total >= 0),
    FOREIGN KEY (id_info_servico) REFERENCES info_servico(id),
    FOREIGN KEY (id_pacote_agend) REFERENCES pacote_agend(id),
    FOREIGN KEY (id_servico_realizado) REFERENCES servico_realizado(id)
);

CREATE TABLE despesa (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    data DATE NOT NULL,
    tipo ENUM("pagamento-funcionario", "prejuizo", "manutencao", "outro") NOT NULL,
    valor DECIMAL(10,2) NOT NULL,

    CONSTRAINT chk_despesa_valor CHECK (valor > 0)
);

-- VIEWS ========================================================================================================================================================================

CREATE OR REPLACE VIEW vw_funcionario AS
    SELECT
        f.id AS id_funcionario,
        f.nome,
        f.telefone,
        COUNT(s_e.id_funcionario) AS qtd_servico_exercido
    FROM funcionario AS f
        LEFT JOIN servico_exercido AS s_e ON (s_e.id_funcionario = f.id)
    GROUP BY f.id
    ORDER BY nome ASC, qtd_servico_exercido ASC;



CREATE OR REPLACE VIEW vw_cliente AS
    SELECT
        c.id AS id_cliente,
        c.nome AS nome,
        c.telefone AS telefone,
        e_c.logradouro AS logradouro_end,
        e_c.numero AS numero_end,
        e_c.bairro AS bairro_end,
        e_c.cidade AS cidade_end,
        e_c.estado AS estado_end
    FROM cliente AS c
        LEFT JOIN endereco_cliente AS e_c ON (e_c.id_cliente = c.id);

    
    
CREATE OR REPLACE VIEW vw_pet AS
    SELECT
        p_c.id AS id_pet,
        p_c.nome AS nome,
        c.id AS id_cliente,
        c.nome AS nome_cliente,
        e.id AS id_especie,
        e.nome AS nome_especie,
        p_c.raca AS raca,
        p_c.porte AS porte,
        p_c.cor AS cor,
        p_c.sexo AS sexo,
        p_c.e_castrado AS e_castrado,
        p_c.cartao_vacina AS cartao_vacina,
        p_c.estado_saude AS estado_saude,
        p_c.comportamento AS comportamento
    FROM pet AS p_c
        INNER JOIN cliente AS c ON (c.id = p_c.id_cliente)
        LEFT JOIN especie AS e ON (e.id = p_c.id_especie)
    ORDER BY id_pet;



CREATE OR REPLACE VIEW vw_info_servico AS
    SELECT
        i_s.*,
        eb_i_s.tipo AS tipo_endereco_buscar,
        eb_i_s.logradouro AS logradouro_endereco_buscar,
        eb_i_s.numero AS numero_endereco_buscar,
        eb_i_s.bairro AS bairro_endereco_buscar,
        eb_i_s.cidade AS cidade_endereco_buscar,
        eb_i_s.estado AS estado_endereco_buscar,
        ed_i_s.tipo AS tipo_endereco_devolver,
        ed_i_s.logradouro AS logradouro_endereco_devolver,
        ed_i_s.numero AS numero_endereco_devolver,
        ed_i_s.bairro AS bairro_endereco_devolver,
        ed_i_s.cidade AS cidade_endereco_devolver,
        ed_i_s.estado AS estado_endereco_devolver
    FROM (
        SELECT
            i_s.id AS id_info_servico,
            s_o.id AS id_servico_oferecido,
            s_o.nome AS nome_servico_oferecido,
            s_o.id_categoria AS id_categoria_servico_oferecido,
            c_s.nome AS nome_categoria_servico,
            i_s.id_cliente AS id_cliente,
            cli.nome AS nome_cliente,
            COUNT(DISTINCT p_s.id_pet) AS qtd_pet_servico,
            i_s.id_funcionario AS id_funcionario,
            f.nome AS nome_funcionario,
            i_s.observacoes AS observacoes
        FROM info_servico AS i_s
                INNER JOIN servico_oferecido AS s_o ON (s_o.id = i_s.id_servico_oferecido)
                    LEFT JOIN categoria_servico AS c_s ON (c_s.id = s_o.id_categoria)
                INNER JOIN cliente AS cli ON (cli.id = i_s.id_cliente)
                LEFT JOIN funcionario AS f ON (f.id = i_s.id_funcionario)
                LEFT JOIN pet_servico AS p_s ON (p_s.id_info_servico = i_s.id)
        GROUP BY i_s.id
        ORDER BY
            nome_servico_oferecido ASC,
            nome_funcionario ASC
    ) AS i_s
        LEFT JOIN endereco_info_servico AS eb_i_s ON (eb_i_s.id_info_servico = i_s.id_info_servico AND eb_i_s.tipo IN ("buscar", "buscar-devolver"))
        LEFT JOIN endereco_info_servico AS ed_i_s ON (ed_i_s.id_info_servico = i_s.id_info_servico AND ed_i_s.tipo IN ("devolver", "buscar-devolver"));



CREATE OR REPLACE VIEW vw_servico_requerido AS
    SELECT
        s_r.id_cliente AS id_cliente,
        c.nome AS nome_cliente,
        s_r.id_servico_oferecido AS id_servico_requerido,
        s_o.nome AS nome_servico,
        s_o.id_categoria AS id_cat_serv_ofer,
        c_s.nome AS nome_categoria,
        s_o.foto AS foto_servico
    FROM servico_requerido AS s_r
        INNER JOIN servico_oferecido AS s_o ON (s_o.id = s_r.id_servico_oferecido)
        LEFT JOIN categoria_servico AS c_s ON (c_s.id = s_o.id_categoria)
        INNER JOIN cliente AS c ON (c.id = s_r.id_cliente);


CREATE OR REPLACE VIEW vw_servico_oferecido AS 
    SELECT
        COUNT(s_o.id) OVER() AS qtd_servicos_oferecidos,
        s_o.id AS id_servico_oferecido,
        s_o.nome AS nome,
        s_o.preco AS preco,
        s_o.tipo_preco AS tipo_preco,
        s_o.id_categoria AS id_categoria,
        c_s.nome AS nome_categoria,
        s_o.descricao AS descricao,
        s_o.foto AS foto,
        s_o.restricao_participante AS restricao_participante,
        COUNT(r_e.id_servico_oferecido) AS qtd_restr_especie
    FROM
        servico_oferecido AS s_o
        LEFT JOIN categoria_servico AS c_s ON (c_s.id = s_o.id_categoria)
        LEFT JOIN restricao_especie AS r_e ON (r_e.id_servico_oferecido = s_o.id)
        LEFT JOIN especie AS e ON (e.id = r_e.id_especie)
    GROUP BY s_o.id
    ORDER BY nome ASC, preco ASC;


CREATE OR REPLACE VIEW vw_restricao_especie_servico AS
    SELECT
        s_o.id AS id_servico_oferecido,
        s_o.nome AS nome,
        r_e.id_especie,
        e.nome AS nome_especie
    FROM
        restricao_especie AS r_e
        INNER JOIN servico_oferecido AS s_o ON (s_o.id = r_e.id_servico_oferecido)
        INNER JOIN especie AS e ON (e.id = r_e.id_especie);


CREATE OR REPLACE VIEW vw_servico_exercido AS
    SELECT
        s_e.id_funcionario AS id_funcionario,
        f.nome AS nome_funcionario,
        s_e.id_servico_oferecido AS id_servico_oferecido,
        s_o.nome AS nome_servico,
        s_o.id_categoria AS id_categoria,
        c_s.nome AS nome_categoria,
        s_o.foto AS foto_servico
    FROM
        servico_exercido AS s_e
        INNER JOIN funcionario AS f ON (f.id = s_e.id_funcionario)
        INNER JOIN
        servico_oferecido AS s_o ON (s_o.id = s_e.id_servico_oferecido)
        LEFT JOIN categoria_servico AS c_s ON (c_s.id = s_o.id_categoria)
        ORDER BY id_funcionario ASC, nome_funcionario ASC, nome_servico ASC, nome_categoria ASC;



CREATE OR REPLACE VIEW vw_servico_realizado AS
    SELECT 
        COUNT(s_r.id) OVER() AS qtd_servico_realizado,
        s_r.id AS id_servico_realizado,
        s_r.dt_hr_inicio AS dt_hr_inicio,
        s_r.dt_hr_fim AS dt_hr_fim,
        s_r.valor_servico AS valor_servico,
        s_r.valor_total AS valor_total,
        i_s.*
    FROM servico_realizado AS s_r
        INNER JOIN vw_info_servico AS i_s ON (i_s.id_info_servico = s_r.id_info_servico)
    ORDER BY 
        dt_hr_fim DESC;



CREATE OR REPLACE VIEW vw_pet_servico AS
    SELECT
        p_s.id AS id_pet_servico,
        p_s.id_info_servico AS id_info_servico,
        s_o.nome AS nome_servico,
        p_c.id AS id_pet,
        p_c.nome AS nome,
        e.id AS id_especie,
        e.nome AS nome_especie,
        p_c.raca AS raca,
        p_c.porte AS porte,
        c.id AS id_cliente,
        c.nome AS nome_cliente,
        p_s.valor_pet AS valor_pet,
        p_s.instrucao_alimentacao AS instrucao_alimentacao,
        COUNT(DISTINCT r_p_s.id) AS qtd_remedio_pet_servico
    FROM pet_servico AS p_s
        INNER JOIN pet AS p_c ON (p_c.id = p_s.id_pet)
            LEFT JOIN especie AS e ON (e.id = p_c.id_especie)
            INNER JOIN cliente AS c ON (c.id = p_c.id_cliente)
        INNER JOIN info_servico AS i_s ON (i_s.id = p_s.id_info_servico)
        INNER JOIN servico_oferecido AS s_o ON (s_o.id = i_s.id_servico_oferecido)
        LEFT JOIN remedio_pet_servico AS r_p_s ON (r_p_s.id_pet_servico = p_s.id)
    GROUP BY p_s.id
    ORDER BY id_info_servico DESC, nome ASC;

CREATE OR REPLACE VIEW vw_agendamento AS
    SELECT
        COUNT(a.id) OVER() AS qtd_agendamento,
        a.id AS id_agendamento,
        a.dt_hr_marcada AS dt_hr_marcada,
        a.estado AS estado,
        a.id_pacote_agend AS id_pacote_agend,
        a.valor_servico AS valor_servico,
        a.valor_total AS valor_total,
        a.id_servico_realizado AS id_servico_realizado,
        i_s.*
    FROM agendamento AS a
        INNER JOIN vw_info_servico AS i_s ON (i_s.id_info_servico = a.id_info_servico)
    ORDER BY
        id_agendamento DESC;


CREATE OR REPLACE VIEW vw_pacote_agend AS
    SELECT
        p_a.id AS id_pacote_agend,
        p_a.dt_inicio AS dt_inicio,
        p_a.hr_agendada AS hr_agendada,
        p_a.frequencia AS frequencia,
        p_a.estado AS estado,
        p_a.qtd_recorrencia AS qtd_recorrencia,
        COUNT(DISTINCT d_p.id) AS qtd_dia_pacote,
        COUNT(DISTINCT a.id) AS qtd_agendamento,
        s_o.id AS id_servico_oferecido,
        s_o.nome AS nome_servico_oferecido,
        s_o.id_categoria AS id_categoria_servico_oferecido,
        c_s.nome AS nome_categoria_servico,
        COUNT(DISTINCT p_p.id_pet) AS qtd_pet_pacote
    FROM pacote_agend AS p_a
        INNER JOIN servico_oferecido AS s_o ON (s_o.id = p_a.id_servico_oferecido)
            LEFT JOIN categoria_servico AS c_s ON (c_s.id = s_o.id_categoria)
        INNER JOIN dia_pacote AS d_p ON (d_p.id_pacote_agend = p_a.id)
        INNER JOIN pet_pacote AS p_p ON (p_p.id_pacote_agend = p_a.id)
        LEFT JOIN agendamento AS a ON (a.id_pacote_agend = p_a.id)
    GROUP BY id_pacote_agend;

CREATE OR REPLACE VIEW vw_pet_pacote AS
    SELECT
        p_p.id AS id_pet_pacote,
        p_p.id_pacote_agend AS id_pacote_agend,
        p_c.id AS id_pet,
        p_c.nome AS nome,
        e.id AS id_especie,
        e.nome AS nome_especie,
        p_c.raca AS raca,
        p_c.porte AS porte,
        c.id AS id_cliente,
        c.nome AS nome_cliente
    FROM pet_pacote AS p_p
        INNER JOIN pet AS p_c ON (p_c.id = p_p.id_pet)
            LEFT JOIN especie AS e ON (e.id = p_c.id_especie)
            INNER JOIN cliente AS c ON (c.id = p_c.id_cliente)
    ORDER BY id_pacote_agend DESC, nome ASC;


-- FUNCTIONS ========================================================================================================================================================================

SET GLOBAL log_bin_trust_function_creators = 1;

DELIMITER $$
CREATE FUNCTION get_last_insert_info_servico ()
    RETURNS INT
    COMMENT 'Retorna o último registro cadastrado em info_servico'
    NOT DETERMINISTIC
    CONTAINS SQL
    BEGIN
        RETURN @last_insert_info_servico_id;
    END;$$
DELIMITER ;


-- TRIGGERS ========================================================================================================================================================================


DELIMITER $$
CREATE TRIGGER trg_info_servico_insert_before
    BEFORE INSERT
    ON info_servico
    FOR EACH ROW
    BEGIN
        DECLARE err_cotas_insuficiente CONDITION FOR SQLSTATE '45001';

        IF dbo.validar_cotas("servico") = FALSE THEN
            SIGNAL err_cotas_insuficiente SET MESSAGE_TEXT = "Cotas insuficientes para cadastro de servico realizado";
        END IF;

        SET @last_insert_info_servico_id = NEW.id;
    END;$$
DELIMITER ;



DELIMITER $$
CREATE TRIGGER trg_info_servico_insert
    AFTER INSERT
    ON info_servico
    FOR EACH ROW
    BEGIN
        SET @last_insert_info_servico_id = NEW.id;
    END;$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_info_servico_update
    AFTER UPDATE
    ON info_servico
    FOR EACH ROW
    BEGIN
        IF OLD.id_funcionario IS NULL AND NEW.id_funcionario IS NOT NULL THEN
                UPDATE agendamento
                    SET estado = "preparado"
                    WHERE
                        id_info_servico = NEW.id
                        AND estado = "criado" LIMIT 1;
        END IF;

    END;$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_reserva_funcionario_insert
BEFORE INSERT
ON reserva_funcionario
FOR EACH ROW
BEGIN
    DECLARE err_data_passado CONDITION FOR SQLSTATE '45000';
    DECLARE err_hora_inicio_passado CONDITION FOR SQLSTATE '45000';

    IF (NEW.data < CURRENT_DATE()) THEN
        SIGNAL err_data_passado SET MESSAGE_TEXT = "Data de reserva nao pode estar no passado";
    ELSEIF (NEW.data = CURRENT_DATE() AND (NEW.hora_inicio < CURRENT_TIME())) THEN
        SIGNAL err_hora_inicio_passado SET MESSAGE_TEXT = 'Hora de inicio nao pode ser anterior o igual a hora do dia atual';
    END IF;
END;$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_pet_pacote_insert /* Validação semelhante à aplicada à tabela pet_servico */
    BEFORE INSERT
    ON pet_pacote
    FOR EACH ROW
    BEGIN
        -- Variáveis de validação do dono
        DECLARE id_cli_este INT; /* cliente associado a este pet */
        DECLARE id_pet_outro INT; /* id de outro pet associado a este pacote_agend */
        DECLARE id_cli_outro INT; /* cliente associado a outro pet do pacote_agend */

        -- Variáveis de validação da espécie
        DECLARE id_ser_ofer INT;
        DECLARE id_esp_este INT;
        DECLARE id_esp_outro INT;
        DECLARE id_esp_cur INT;
        DECLARE cur_done INT DEFAULT FALSE;
        DECLARE serv_tem_restr_esp INT DEFAULT FALSE;
        DECLARE validar_esp INT DEFAULT TRUE;
        DECLARE esp_valida INT DEFAULT FALSE;
        
        -- Variáveis de validação de participantes
        DECLARE restr_partic ENUM("individual", "coletivo");

        -- Condições de erro
        DECLARE err_dono_diferente CONDITION FOR SQLSTATE '45000'; /* pet inserido pertence a outro dono */
        DECLARE err_esp_incompativel CONDITION FOR SQLSTATE '45001'; /* espécie do pet é incompatível com as das restrições de espécie aplicadas */
        DECLARE err_qtd_partic_excedido CONDITION FOR SQLSTATE '45002'; /* não é possível adicionar outro pet, devido à restriçao de participantes aplicada  */

         -- Cursores
        DECLARE cur_especie CURSOR FOR
            SELECT
                id_especie
                FROM restricao_especie
                WHERE id_servico_oferecido = (
                    SELECT id_servico_oferecido
                        FROM pacote_agend
                        WHERE id = NEW.id_pacote_agend
                );

        -- Handlers
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET cur_done = TRUE;


        -- Buscando o id de outro pet existe para o mesmo pacote_agend
        SELECT id_pet
            INTO id_pet_outro
            FROM pet_pacote
            WHERE
                id_pacote_agend = NEW.id_pacote_agend
            LIMIT 1;

        -- Validação dos participantes do pacote_agend
        SELECT restricao_participante INTO restr_partic FROM servico_oferecido WHERE id = (
            SELECT id_servico_oferecido FROM pacote_agend WHERE id = NEW.id_pacote_agend
        );

        -- Obtém as informações do PET sendo inserido
        SELECT id_cliente, id_especie INTO id_cli_este, id_esp_este FROM pet WHERE id = NEW.id_pet;
        
        IF id_pet_outro IS NOT NULL THEN /* Já existe outro pet para o pacote_agend */

            IF restr_partic = "individual" THEN
                SIGNAL err_qtd_partic_excedido
                    SET MESSAGE_TEXT = "Nao e permitido adicionar pet, pois o servico_oferecido possui restricao individual";
            END IF;
            
            -- Validação se o pet pertence ao mesmo dono
            SELECT id_cliente INTO id_cli_outro FROM pet WHERE id = id_pet_outro;

            IF id_cli_este <> id_cli_outro THEN
                SIGNAL err_dono_diferente
                    SET MESSAGE_TEXT = "Pet nao pode ser inserido, pois pertence a um dono diferente dos que já existem para este pacote_agend";
            END IF;
            
            SELECT id_especie INTO id_esp_outro FROM pet WHERE id = id_pet_outro LIMIT 1;
            
            IF id_esp_este = id_esp_outro THEN
                SET validar_esp = FALSE;
            END IF;

        END IF;


        -- Validação da espécie do pet
        IF validar_esp IS TRUE THEN
            OPEN cur_especie;
            especie_loop: LOOP
                FETCH cur_especie INTO id_esp_cur;
                
                IF id_esp_cur IS NOT NULL THEN
                    SET serv_tem_restr_esp = TRUE;
                
                    IF id_esp_cur = id_esp_este THEN
                        SET esp_valida = TRUE;
                        LEAVE especie_loop;
                    END IF;
                END IF;
                
                IF cur_done THEN
                    LEAVE especie_loop;
                END IF;
                
            END LOOP;
            CLOSE cur_especie;
            
            IF serv_tem_restr_esp IS TRUE AND esp_valida IS FALSE THEN
                SIGNAL err_esp_incompativel
                    SET MESSAGE_TEXT = "Especie do pet inserido e incompativel com restricoes de especie do servico_oferecido";
            END IF;
        END IF;
    END;$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_pet_servico_insert
    BEFORE INSERT
    ON pet_servico
    FOR EACH ROW
    BEGIN
        -- Variáveis de definição do valor_pet
        DECLARE tipo_p VARCHAR(16); /*Tipo da cobrança do serviço*/
        DECLARE p DECIMAL(8,2); /* Preço cobrado pelo serviço */

        -- Variáveis de validação do dono
        DECLARE id_cli_este INT; /* cliente associado a este pet */
        DECLARE id_pet_outro INT; /* id de outro pet associado a este info_servico */
        DECLARE id_cli_outro INT; /* cliente associado a outro pet do info_servico*/

        -- Variáveis de validação da espécie
        DECLARE id_ser_ofer INT;
        DECLARE id_esp_este INT;
        DECLARE id_esp_outro INT;
        DECLARE id_esp_cur INT;
        DECLARE cur_done INT DEFAULT FALSE;
        DECLARE serv_tem_restr_esp INT DEFAULT FALSE;
        DECLARE validar_esp INT DEFAULT TRUE;
        DECLARE esp_valida INT DEFAULT FALSE;
        
        -- Variáveis de validação de participantes
        DECLARE restr_partic ENUM("individual", "coletivo");

        -- Condições de erro
        DECLARE err_pet_inexistente CONDITION FOR SQLSTATE '45003';
        DECLARE err_dono_diferente CONDITION FOR SQLSTATE '45000'; /* pet inserido pertence a outro dono */
        DECLARE err_esp_incompativel CONDITION FOR SQLSTATE '45001'; /* espécie do pet é incompatível com as das restrições de espécie aplicadas */
        DECLARE err_qtd_partic_excedido CONDITION FOR SQLSTATE '45002'; /* não é possível adicionar outro pet, devido à restriçao de participantes aplicada  */
        
         -- Cursores
        DECLARE cur_especie CURSOR FOR
            SELECT
                id_especie
                FROM restricao_especie
                WHERE id_servico_oferecido = (
                    SELECT id_servico_oferecido
                        FROM info_servico
                        WHERE id = NEW.id_info_servico
                );

        -- Handlers
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET cur_done = TRUE;
    
        -- Obtendo informação sobre a forma de cobrança do serviço
        SELECT
            preco, tipo_preco
        INTO
            p, tipo_p
        FROM
            servico_oferecido
        WHERE
            id = (
                SELECT id_servico_oferecido
                FROM info_servico
                WHERE id = NEW.id_info_servico 
        LIMIT 1);
        
        IF tipo_p = 'pet' THEN
            SET NEW.valor_pet = p;
        ELSE
            SET NEW.valor_pet = NULL;
        END IF;
        
        -- Buscando o id de outro pet existe para o mesmo info_servico
        SELECT id_pet
            INTO id_pet_outro
            FROM pet_servico
            WHERE
                id_info_servico = NEW.id_info_servico
            LIMIT 1;

        -- Validação dos participantes do info_servico
        SELECT restricao_participante INTO restr_partic FROM servico_oferecido WHERE id = (
            SELECT id_servico_oferecido FROM info_servico WHERE id = NEW.id_info_servico
        );

        -- Obtém as informações do PET sendo inserido
        SELECT id_cliente, id_especie INTO id_cli_este, id_esp_este FROM pet WHERE id = NEW.id_pet;
        
        IF id_esp_este IS NULL THEN
            SIGNAL err_pet_inexistente SET MESSAGE_TEXT = "Não foi possível verificar a espécie de um dos pets inserido";
        END IF;
    
        IF id_pet_outro IS NOT NULL THEN /* Já existe outro pet para o info_servico */

            IF restr_partic = "individual" THEN
                SIGNAL err_qtd_partic_excedido
                    SET MESSAGE_TEXT = "Nao e permitido adicionar pet, pois o servico_oferecido possui restricao individual";
            END IF;
            
            -- Validação se o pet pertence ao mesmo dono
            SELECT id_cliente INTO id_cli_outro FROM pet WHERE id = id_pet_outro;
            
            IF id_cli_este <> id_cli_outro THEN
                SIGNAL err_dono_diferente
                    SET MESSAGE_TEXT = "Pet nao pode ser inserido, pois pertence a um dono diferente dos que já existem para este info_servico";
            END IF;

            SELECT id_especie INTO id_esp_outro FROM pet WHERE id = id_pet_outro LIMIT 1;
            
            IF id_esp_este = id_esp_outro THEN
                SET validar_esp = FALSE;
            END IF;
        END IF;

        -- Validação da espécie do pet
        IF validar_esp IS TRUE THEN
            OPEN cur_especie;
            especie_loop: LOOP
                FETCH cur_especie INTO id_esp_cur;
                
                IF id_esp_cur IS NOT NULL THEN
                    SET serv_tem_restr_esp = TRUE;
                END IF;
            
                IF id_esp_cur = id_esp_este THEN
                    SET esp_valida = TRUE;
                    LEAVE especie_loop;
                END IF;
                
                IF cur_done THEN
                    LEAVE especie_loop;
                END IF;
                
            END LOOP;
            CLOSE cur_especie;
            
            IF serv_tem_restr_esp IS TRUE AND esp_valida IS FALSE THEN
                SIGNAL err_esp_incompativel
                    SET MESSAGE_TEXT = "Especie do pet inserido e incompativel com restricoes de especie do servico_oferecido";
            END IF;
        END IF;
    END;$$
DELIMITER ;



DELIMITER $$
CREATE TRIGGER trg_pet_servico_insert_after
    AFTER INSERT
    ON pet_servico
    FOR EACH ROW
    BEGIN
        DECLARE id_agend INT;
        DECLARE id_serv_real INT;
        DECLARE NEW_valor_total DECIMAL(8,2);
        DECLARE NEW_valor_servico DECIMAL(8,2);

        -- Obtém valores para cobrança do agendamento ou servico_realizado
        IF NEW.id_info_servico IS NOT NULL THEN
            CALL get_valores_info_servico(NEW.id_info_servico, NEW_valor_servico, NEW_valor_total);

            UPDATE info_servico SET id_cliente = (
                SELECT id_cliente FROM pet WHERE id = NEW.id_pet LIMIT 1
            ) WHERE id = NEW.id_info_servico; 
        
            -- Obtendo id do servico_realizado
            SELECT
                id
                INTO id_serv_real
                FROM servico_realizado
                WHERE
                    id_info_servico = NEW.id_info_servico
                LIMIT 1;

            -- Atualizando valores no servico_realizado
            IF id_serv_real IS NOT NULL THEN
                UPDATE servico_realizado
                    SET valor_servico = NEW_valor_servico,
                        valor_total = NEW_valor_total
                    WHERE id = id_serv_real;
            END IF;

            -- Obtendo o id do agendamento
            SELECT
                id
                INTO id_agend
                FROM agendamento
                WHERE
                    id_info_servico = NEW.id_info_servico
                LIMIT 1;

            -- Atualizando valores no agendamento
            IF id_agend IS NOT NULL THEN
                UPDATE agendamento
                SET valor_servico = NEW_valor_servico,
                    valor_total = NEW_valor_total
                WHERE id = id_agend;
            END IF;
        END IF;
    END;$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_pet_servico_update
    AFTER UPDATE
    ON pet_servico
    FOR EACH ROW
    BEGIN
        DECLARE id_agend INT;
        DECLARE id_serv_real INT;
        DECLARE NEW_valor_total DECIMAL(8,2);
        DECLARE NEW_valor_servico DECIMAL(8,2);

        -- Obtém valores atualizados para cobrança do agendamento ou servico_realizado
        IF NEW.id_info_servico IS NOT NULL THEN
            CALL get_valores_info_servico(NEW.id_info_servico, NEW_valor_servico, NEW_valor_total);

            -- Obtendo id do servico_realizado
            SELECT
                id
                INTO id_serv_real
                FROM servico_realizado
                WHERE
                    id_info_servico = NEW.id_info_servico
                LIMIT 1;

            -- Atualizando servico_realizado
            IF id_serv_real IS NOT NULL THEN
                UPDATE servico_realizado
                    SET valor_servico = NEW_valor_servico,
                        valor_total = NEW_valor_total
                    WHERE id = id_serv_real;
            END IF;

            -- Obtendo o id do agendamento
            SELECT
                id
                INTO id_agend
                FROM agendamento
                WHERE
                    id_info_servico = NEW.id_info_servico
                LIMIT 1;

            IF id_agend IS NOT NULL THEN
                UPDATE agendamento
                SET valor_servico = NEW_valor_servico,
                    valor_total = NEW_valor_total
                WHERE id = id_agend;
            END IF;
        END IF;
    END;$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_servico_realizado_insert /* Fazer procedimento que atualiza preços */
    BEFORE INSERT
    ON servico_realizado
    FOR EACH ROW
    BEGIN
        -- Verificação dos valores a serem inseridos
        IF ISNULL(NEW.valor_servico) AND ISNULL(NEW.valor_total) THEN
            -- Buscando valor e forma de cobrança da tabela "servico_oferecido" e atualizando automaticamente
            CALL get_valores_info_servico(NEW.id_info_servico, NEW.valor_servico, NEW.valor_total);
        END IF;
    END;$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_agendamento_insert
    BEFORE INSERT
    ON agendamento
    FOR EACH ROW
    BEGIN
        -- Variáveis usadas na definição do estado inicial
        DECLARE id_func INT;

        -- Verificação de funcionário atribuído e atribuição de estado inicial
        SELECT id_funcionario INTO id_func FROM info_servico WHERE id = NEW.id_info_servico;

        IF (id_func IS NOT NULL) THEN /* Se funcionário está atribuído */
            SET NEW.estado = "preparado";
        ELSE
            SET NEW.estado = "criado";
        END IF;

        -- Verificação dos valores a serem inseridos
        IF ISNULL(NEW.valor_servico) AND ISNULL(NEW.valor_total) THEN
            -- Buscando valor e forma de cobrança da tabela "agendamento" e atualizando automaticamente
            CALL get_valores_info_servico(NEW.id_info_servico, NEW.valor_servico, NEW.valor_total);
        END IF;
    END;$$
DELIMITER ;



DELIMITER $$
CREATE TRIGGER trg_agendamento_update
    BEFORE UPDATE
    ON agendamento
    FOR EACH ROW
    BEGIN
        DECLARE dt_hr_ini DATETIME DEFAULT NEW.dt_hr_marcada;
        DECLARE dt_hr_fin DATETIME DEFAULT CURRENT_TIMESTAMP();
        DECLARE id_func INT;

        DECLARE err_alt_est CONDITION FOR SQLSTATE '45001';

        IF OLD.estado = "criado" AND NEW.estado IN ("pendente", "concluido") THEN
            SIGNAL err_alt_est SET MESSAGE_TEXT = 'Não é possível alterar estado do agendamento pois o funcionário ainda não foi atribuído';
        END IF;

        IF NEW.estado IN ("criado", "preparado", "pendente") AND OLD.estado IN ("concluido", "cancelado") THEN 
            SIGNAL err_alt_est SET MESSAGE_TEXT = 'Não é possível atribuir um estado anterior a um agendamento concluído ou cancelado';
        END IF;
        
        -- Buscando funcionário
        SELECT id_funcionario INTO id_func FROM info_servico WHERE id = NEW.id_info_servico;
        
        IF id_func IS NULL AND OLD.estado = "criado" AND NEW.estado = "preparado" THEN 
            SIGNAL err_alt_est SET MESSAGE_TEXT = "Não é possível atribuír estado de preparado pois não foi definido o funcionário atribuído";
        END IF;
        
        IF NEW.estado IN ("criado", "preparado") AND OLD.estado IN ("preparado", "pendente") THEN 
            SIGNAL err_alt_est SET MESSAGE_TEXT = "Não é possível atribuír estado de anterior ou igual ao atual ao agendamento";
        END IF;
        
        IF NEW.estado = "concluido" AND NEW.id_servico_realizado IS NULL AND OLD.estado IN ("preparado", "pendente") THEN
            IF dt_hr_ini > dt_hr_fin OR DATEDIFF(dt_hr_fin, dt_hr_ini) <> 0 THEN
                SET dt_hr_ini = NULL;
            END IF;

            INSERT INTO servico_realizado (id_info_servico, dt_hr_inicio, dt_hr_fim) VALUE
                (NEW.id_info_servico, dt_hr_ini, CURRENT_TIMESTAMP());

            SET NEW.id_servico_realizado = LAST_INSERT_ID();
        END IF;
    END;$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_incidente_insert
    BEFORE INSERT
    ON incidente
    FOR EACH ROW
    BEGIN
        DECLARE dt_hr_ini_serv DATETIME;
        DECLARE dt_hr_fim_serv DATETIME;

        DECLARE err_dt_hr CONDITION FOR SQLSTATE '45000';

        SELECT dt_hr_inicio, dt_hr_fim
            INTO dt_hr_ini_serv, dt_hr_fim_serv
            FROM servico_realizado
            WHERE id = NEW.id_servico_realizado;

        IF NEW.dt_hr_ocorrido > CURRENT_TIMESTAMP() THEN
            SIGNAL err_dt_hr
                SET MESSAGE_TEXT = "Data de ocorrencia deve ser anterior ao momento atual";
        ELSEIF NEW.dt_hr_ocorrido > dt_hr_fim_serv THEN
            SIGNAL err_dt_hr
                    SET MESSAGE_TEXT = "Data de ocorrencia deve ser anterior a finalizacao do servico realizado";
        ELSEIF NEW.dt_hr_ocorrido < dt_hr_ini_serv THEN
            SIGNAL err_dt_hr
                    SET MESSAGE_TEXT = "Data de ocorrencia deve ser posterior ao inicio do servico realizado";
        END IF;
    END;$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_incidente_update
    BEFORE UPDATE
    ON incidente
    FOR EACH ROW
    BEGIN
        DECLARE dt_hr_ini_serv DATETIME;
        DECLARE dt_hr_fim_serv DATETIME;

        DECLARE err_dt_hr CONDITION FOR SQLSTATE '45000';

        SELECT dt_hr_inicio, dt_hr_fim
            INTO dt_hr_ini_serv, dt_hr_fim_serv
            FROM servico_realizado
            WHERE id = NEW.id_servico_realizado;

        IF NEW.dt_hr_ocorrido > CURRENT_TIMESTAMP() THEN
            SIGNAL err_dt_hr
                SET MESSAGE_TEXT = "Data de ocorrencia deve ser anterior ao momento atual";
        ELSEIF NEW.dt_hr_ocorrido > dt_hr_fim_serv THEN
            SIGNAL err_dt_hr
                    SET MESSAGE_TEXT = "Data de ocorrencia deve ser anterior a finalizacao do servico realizado";
        ELSEIF NEW.dt_hr_ocorrido < dt_hr_ini_serv THEN
            SIGNAL err_dt_hr
                    SET MESSAGE_TEXT = "Data de ocorrencia deve ser posterior ao inicio do servico realizado";
        END IF;
    END;$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_pacote_agend_update
    BEFORE UPDATE
    ON pacote_agend
    FOR EACH ROW
    BEGIN
        DECLARE pets_found INT;
        DECLARE dias_found INT;
        DECLARE cur_done INT DEFAULT FALSE; /* variável de controle do loop dos cursores */
        DECLARE id_pac INT DEFAULT OLD.id;
        DECLARE qtd_count INT DEFAULT 0; /* Controla quantas recorrências da frequêncai foram cadastradas */
        DECLARE offset_count INT DEFAULT 0;
        -- Infos para agendamento
        DECLARE id_agend INT;
        DECLARE dt_hr_marc DATETIME; /* Guarda o dia que foi calculado para ser inserido no agendamento, e adicionado do horário do pacote */
        DECLARE dt_agend DATETIME;
        DECLARE dia_pac INT;
        DECLARE dt_base DATETIME;
        DECLARE objAgend JSON;
            /*Formato para "objAgend":
                {
                    "dtHrMarcada": <DATETIME>,
                    "info": {
                        "servico": <INT>, <-- PK da tabela servico_oferecido (id_servico_oferecido em "info_servico")
                        "pets" : [
                            +{
                                "id": <INT> <-- PK da tabela pet (id_pet em "pet_servico")
                            }
                        ]
                    }
                }
            */

        -- Info pets
        DECLARE id_pet_cli INT;

        DECLARE err_missing_info CONDITION FOR SQLSTATE '45000';

        -- Cursores
        DECLARE cur_pets CURSOR FOR SELECT id_pet FROM pet_pacote WHERE id_pacote_agend = id_pac;
        DECLARE cur_dias CURSOR FOR SELECT dia FROM dia_pacote WHERE id_pacote_agend = id_pac;

        -- Handlers para cursores
        DECLARE CONTINUE HANDLER
            FOR NOT FOUND
            SET cur_done = TRUE;

        IF NEW.estado = "preparado" AND OLD.estado = "criado" THEN
            SET NEW.estado = "criado"; /* Mantém o estado antigo para caso houver erro durante a criação dos agendamentos */

            -- Verificar se possui dias agendados e pets participantes
            SELECT id INTO dias_found FROM dia_pacote WHERE id_pacote_agend = id_pac LIMIT 1;
            SELECT id INTO pets_found FROM pet_pacote WHERE id_pacote_agend = id_pac LIMIT 1;


            IF (pets_found IS NULL OR dias_found IS NULL) THEN
                SIGNAL err_missing_info
                    SET MESSAGE_TEXT = "Faltam informacoes necessarias no pacote de agendamento";
            END IF;

            -- Criar JSON modelo para agendamentos
            SET objAgend = JSON_OBJECT();
            SET objAgend = JSON_INSERT(objAgend, '$.info', JSON_OBJECT());
            SET objAgend = JSON_INSERT(objAgend, '$.info.servico', OLD.id_servico_oferecido);
            SET objAgend = JSON_INSERT(objAgend, '$.info.pets', JSON_ARRAY());

            -- Preenchendo array de pets
            OPEN cur_pets;
            pets_loop: LOOP
                FETCH cur_pets INTO id_pet_cli;

                IF cur_done = TRUE THEN
                    LEAVE pets_loop;
                END IF;

                -- Inserindo pets no JSON
                SET objAgend = JSON_ARRAY_INSERT(objAgend, '$.info.pets[0]', JSON_OBJECT());
                SET objAgend = JSON_INSERT(objAgend, '$.info.pets[0].id', id_pet_cli);

            END LOOP;
            CLOSE cur_pets;


            -- Definindo a data base para os cálculos
            SET dt_base = DATE_ADD(OLD.dt_inicio, INTERVAL OLD.hr_agendada HOUR_SECOND);
            CASE OLD.frequencia
                WHEN "dias_semana" THEN
                    SET dt_base = DATE_ADD(dt_base, INTERVAL -(DAYOFWEEK(OLD.dt_inicio) -1) DAY); /* Encontra o primeiro dia da semana (domingo = 1) de "dt_inicio" */

                WHEN "dias_mes" THEN
                    SET dt_base = DATE_ADD(dt_base, INTERVAL -(DAYOFMONTH(OLD.dt_inicio) -1) DAY); /* Encontra o primeiro dia do mês (= 1) de "dt_inicio" */

                WHEN "dias_ano" THEN
                    SET dt_base = DATE_ADD(dt_base, INTERVAL -(DAYOFYEAR(OLD.dt_inicio) -1) DAY); /* Encontra o primeiro dia do ano (= 1) de "dt_inicio" */
            END CASE;

            -- Loop de criação de agendamentos
            SET cur_done = FALSE;
            OPEN cur_dias;
            dias_loop: LOOP

                FETCH cur_dias INTO dia_pac;

                IF cur_done = TRUE THEN
                    LEAVE dias_loop;
                END IF;

                SET dt_agend = DATE_ADD(dt_base, INTERVAL (dia_pac - 1) DAY);
                -- Loop de repetição do dia especificado, de acordo com "qtd_recorrencia"
                SET qtd_count = 0;
                SET offset_count = 0;
                WHILE qtd_count < OLD.qtd_recorrencia DO

                    CASE OLD.frequencia
                        WHEN "dias_semana" THEN
                            SET dt_hr_marc = DATE_ADD(dt_agend, INTERVAL offset_count WEEK);
                        WHEN "dias_mes" THEN
                            SET dt_hr_marc = DATE_ADD(dt_agend, INTERVAL offset_count MONTH);
                        WHEN "dias_ano" THEN
                            SET dt_hr_marc = DATE_ADD(dt_agend, INTERVAL offset_count YEAR);
                    END CASE;

                    -- se dt_agend é igual ou superior a dt_inicio e ao momento atual
                    IF dt_hr_marc >= OLD.dt_inicio AND dt_hr_marc > CURRENT_TIMESTAMP() THEN
                        -- Criação do agendamento
                        SET objAgend = JSON_SET(objAgend, '$.dtHrMarcada', dt_hr_marc);
                        CALL agendamento('insert', objAgend);
                        SET id_agend = LAST_INSERT_ID();
                        -- Atribuição da FK de pacote_agend
                        UPDATE agendamento SET id_pacote_agend = id_pac WHERE id = id_agend;

                        SET qtd_count = qtd_count + 1;
                    END IF;

                    SET offset_count = offset_count + 1;
                END WHILE;
            END LOOP;
            CLOSE cur_dias;
            SET NEW.estado = "ativo"; /* Atualiza o estado final */
        END IF;
    END;$$
DELIMITER ;


-- PROCEDURES ================================================================================================================================================================

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


DELIMITER $$
CREATE PROCEDURE ins_info_servico(
    IN id_serv_oferecido INT,
    IN id_func INT,
    IN obs VARCHAR(250))
    BEGIN
        INSERT INTO info_servico (id_servico_oferecido, id_funcionario, observacoes) VALUE
            (id_serv_oferecido, id_func, obs);
    END;$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE ins_pet_servico (
    IN id_p INT,
    IN id_info_serv INT,
    IN instrucao_alim TEXT)
    COMMENT 'Insere um registros de pet a uma informação de serviço'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        INSERT INTO pet_servico (id_pet, id_info_servico, instrucao_alimentacao) VALUE
            (id_p, id_info_serv, instrucao_alim);
    END;$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE ins_remedio_pet_servico (
    IN id_pet_serv INT,
    IN nome_rem VARCHAR(128),
    IN inst TEXT)
    COMMENT 'Atribui um remédio a um pet participante de um serviço'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        INSERT INTO remedio_pet_servico (id_pet_servico, nome, instrucoes) VALUE
            (id_pet_serv, nome_rem, inst);
    END;$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE ins_endereco_info_servico (
    IN id_info_serv INT,
    IN tip VARCHAR(24),
    IN logr VARCHAR(128),
    IN num VARCHAR(16),
    IN bai VARCHAR(64),
    IN cid VARCHAR(64),
    IN est CHAR(2))
    COMMENT 'Insere um novo endereço relacionado a um registro de info_servico'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Validação é feita por trigger na tabela endereco_info_servico
        INSERT INTO endereco_info_servico(id_info_servico, tipo, logradouro, numero, bairro, cidade, estado) VALUE
            (id_info_serv, tip, logr, num, bai, cid, est);
    END;$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE  set_funcionario_info_servico(
    IN id_func INT,
    IN id_info_serv INT)
    COMMENT 'Altera o registro da informação de serviço atualizando o funcionário atribuído'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- TODO: fazer validação de quando o id_info_servico não existe
        UPDATE info_servico SET id_funcionario = id_func WHERE id = id_info_serv LIMIT 1;
    END;$$
DELIMITER ;


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


DELIMITER $$
CREATE PROCEDURE agendamento
    (
        IN acao ENUM("insert", "update"),
        IN objAgend JSON
    )
    COMMENT 'Insere ou modifica o registro de um agendamento e suas tabelas relacionadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de agendamento
        DECLARE id_agend INT;
        DECLARE id_info_serv INT; /* PK da tabela info_servico*/
        DECLARE dt_hr_marc DATETIME;
        DECLARE objInfo JSON;
        DECLARE cadastrarPacote INT;
        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_info_object CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';

        -- Validação geral
        IF JSON_TYPE(objAgend) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        SET dt_hr_marc = CAST(JSON_UNQUOTE(JSON_EXTRACT(objAgend, '$.dtHrMarcada')) AS DATETIME);
        SET objInfo = JSON_EXTRACT(objAgend, '$.info');
        
        -- Processos para inserção de agendamento
        IF acao = "insert" THEN
            IF ISNULL(objInfo) THEN
                SIGNAL err_no_info_object SET MESSAGE_TEXT = 'Nenhum objeto de info_servico foi informado para insert do servico_realizado';
            END IF;

            SET objInfo = JSON_REMOVE(objInfo, '$.id'); /* Remove para não gerar problemas, pois id aqui é o do servico_realizado, mas no procedimento info_servico() é o do info_servico */
            CALL info_servico('insert', objInfo);
            SET id_info_serv = get_last_insert_info_servico(); /* Recebe o último id de info_servico cadastrado */

            -- Inserção do agendamento
            INSERT INTO agendamento (id_info_servico, dt_hr_marcada) VALUE (id_info_serv, dt_hr_marc);
            
            SET @id_agendamento = LAST_INSERT_ID();            
        ELSEIF acao = "update" THEN
            -- Obtendo o id do agendamento a ser atualizado
            SET id_agend = JSON_EXTRACT(objAgend, '$.id');

            IF ISNULL(id_agend) THEN /* Se id_agendamento não for informado */
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de agendamento para acao update";
            END IF;

            IF (objInfo IS NOT NULL) THEN /* Info_servico foi incluida para ser modificada */
                -- Obtendo FK de info_servico
                SELECT
                    id_info_servico
                INTO id_info_serv
                FROM agendamento
                WHERE
                    id = id_agend;

                IF ISNULL(id_info_serv) THEN
                    SIGNAL err_no_for_id_update SET MESSAGE_TEXT = 'id de agendamento inexistente para update';
                END IF;

                SET objInfo = JSON_INSERT(objInfo, '$.id', id_info_serv);

                CALL info_servico('update', objInfo);
            END IF;

            -- Altera registro do servico_realizad
            UPDATE agendamento SET dt_hr_marcada = dt_hr_marc WHERE id = id_agend;
            
            SET @id_agendamento = id_agend;            
        END IF;
    END;$$
DELIMITER ;



DELIMITER $$
CREATE PROCEDURE set_estado_agendamento(
    IN est ENUM("criado", "preparado", "pendente", "concluido", "cancelado"),
    IN id_agend INT
    )
    COMMENT 'Define um novo estado para o agendamento'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        UPDATE agendamento SET estado = est WHERE id = id_agend;
    END;$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE servico_realizado
    (
        IN acao ENUM("insert", "update"),
        IN objServ JSON
    )
    COMMENT 'Insere ou modifica o registro de um servico realizado e suas tabelas relacionadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de serviço
        DECLARE id_serv_real INT; /* PK em "servico_realizado" */
        DECLARE id_info_serv INT; /* PK da tabela info_servico*/
        DECLARE dt_hr_ini, dt_hr_fin DATETIME;
        DECLARE objInfo JSON;

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_info_object CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';

        -- Validação geral
        IF JSON_TYPE(objServ) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        SET dt_hr_ini = CAST( JSON_UNQUOTE(JSON_EXTRACT(objServ, '$.inicio')) AS DATETIME );
        SET dt_hr_fin = CAST( JSON_UNQUOTE(JSON_EXTRACT(objServ, '$.fim')) AS DATETIME );
        SET objInfo = JSON_EXTRACT(objServ, '$.info');

        -- Processos para inserção de servico_realizado
        IF acao = "insert" THEN
            IF ISNULL(objInfo) THEN
                SIGNAL err_no_info_object SET MESSAGE_TEXT = 'Nenhum objeto de info_servico foi informado para insert do servico_realizado';
            END IF;

            SET objInfo = JSON_REMOVE(objInfo, '$.id'); /* Remove para não gerar problemas, pois id aqui é o do servico_realizado, mas no procedimento info_servico() é o do info_servico */
            CALL info_servico('insert', objInfo);
            SET id_info_serv = get_last_insert_info_servico(); /* Recebe o último id de info_servico cadastrado */

            -- Inserção do serviço realizado
            INSERT INTO servico_realizado (id_info_servico, dt_hr_inicio, dt_hr_fim) VALUE (id_info_serv, dt_hr_ini, dt_hr_fin);
            
            SELECT LAST_INSERT_ID() AS id_servico_realizado;
        ELSEIF acao = "update" THEN
            SET id_serv_real = JSON_EXTRACT(objServ, '$.id');

            IF ISNULL(id_serv_real) THEN /* Se id_servico_realizado não for informado */
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de servico_realizado para acao update";
            END IF;

            IF (objInfo IS NOT NULL) THEN /* Info_servico foi incluida para ser modificada */
                -- Obtendo FK de info_servico
                SELECT
                    id_info_servico
                INTO id_info_serv
                FROM servico_realizado
                WHERE
                    id = id_serv_real;

                IF ISNULL(id_info_serv) THEN
                    SIGNAL err_no_for_id_update SET MESSAGE_TEXT = 'id de servico inexistente para update';
                END IF;

                SET objInfo = JSON_INSERT(objInfo, '$.id', id_info_serv);

                CALL info_servico('update', objInfo);
            END IF;

            -- Altera registro do servico_realizad
            UPDATE servico_realizado SET dt_hr_inicio = dt_hr_ini, dt_hr_fim = dt_hr_fin WHERE id = id_serv_real;
            
            SELECT id_serv_real AS id_servico_realizado;
        END IF;
    END;$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE incidente (
    IN acao ENUM('insert', 'update', 'delete'),
    IN objInc JSON
    )
    COMMENT 'Altera registro de incidente de acordo com ações informadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de incidente
        DECLARE id_inc INT;
        DECLARE id_serv_real INT;
        DECLARE tipo_inc ENUM("emergencia-medica", "briga", "mau-comportamento", "agressao");
        DECLARE dt_hr_ocorr DATETIME;
        DECLARE rel TEXT;
        DECLARE med_tom TEXT;
        DECLARE inc_found INT; /* Usado para verificar se incidente existe antes de update ou delete*/

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_not_array CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';

        -- Validação geral
        IF JSON_TYPE(objInc) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        SET id_serv_real = JSON_EXTRACT(objInc, '$.servicoRealizado');
        SET tipo_inc = JSON_UNQUOTE(JSON_EXTRACT(objInc, '$.tipo'));
        SET dt_hr_ocorr = CAST(JSON_UNQUOTE(JSON_EXTRACT(objInc, '$.dtHrOcorrido')) AS DATETIME); /* Validação é feita por trigger na tabela "incidente" */
        SET rel = JSON_UNQUOTE(JSON_EXTRACT(objInc, '$.relato'));
        SET med_tom = JSON_UNQUOTE(JSON_EXTRACT(objInc, '$.medidaTomada'));

        -- Processos para inserção de incidente
        IF acao = "insert" THEN
            -- Inserção do incidente
            INSERT INTO incidente (
                id_servico_realizado, tipo, dt_hr_ocorrido, relato, medida_tomada)
                VALUE (id_serv_real, tipo_inc, dt_hr_ocorr, rel, med_tom);
            SET id_inc = LAST_INSERT_ID();
            SELECT id_inc AS id_incidente;
        ELSEIF acao IN ("update", "delete") THEN
            SET id_inc = JSON_EXTRACT(objInc, '$.id');

            IF id_inc IS NULL THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de incidente para acao";
            END IF;

            -- Buscando se existe algum incidente correspondente já existente
            SELECT id
                INTO inc_found
                FROM incidente
                WHERE id = id_inc;

            IF inc_found IS NULL THEN
                SIGNAL err_no_for_id_update
                    SET MESSAGE_TEXT = "Nao foi encontrado incidente existente para acao";
            ELSE
                CASE acao
                    WHEN "update" THEN
                        UPDATE incidente
                            SET
                                id_servico_realizado = id_serv_real,
                                tipo = tipo_inc,
                                dt_hr_ocorrido = dt_hr_ocorr,
                                relato = rel,
                                medida_tomada = med_tom
                            WHERE id = id_inc;
            
                        SELECT id_inc AS id_incidente;
                    WHEN "delete" THEN
                        DELETE FROM incidente WHERE id = id_inc;
                END CASE;
            END IF;
        END IF;
    END;$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE pacote_agend (
    IN acao ENUM('insert', 'update', 'delete'),
    IN objPac JSON
    )
    COMMENT 'Altera registro de pacote_agend de acordo com ações informadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de pacote_agend
        DECLARE id_pac INT;
        DECLARE id_serv_ofer INT;
        DECLARE dt_ini DATE;
        DECLARE hr_agend TIME;
        DECLARE freq ENUM("dias_semana", "dias_mes", "dias_ano");
        DECLARE qtd_rec INT;
        DECLARE pac_found INT; /* Usado para verificar se pacote_agend existe antes de update ou delete*/
        -- Infos de dia_pacote
        DECLARE arrayObjDiaPac JSON; /* Array de dia_pacote incluídos */
        DECLARE id_dia_pac INT;
        DECLARE d_length INT; /* quantidade de dia_pacote incluídos no array JSON de "diasPacote"*/
        DECLARE d_count INT;
        DECLARE dia_pac INT;
        DECLARE dia_found INT; /* id_dia_pacote, se encontrado na busca pelo update */
        DECLARE arrayDiaPac JSON;

        -- Infos de pet_pacote
        DECLARE arrayObjPetPac JSON; /* Array de pet_pacote incluídos */
        DECLARE p_length INT; /* quantidade de pet_pacote incluídos no array JSON de "petsPacote"*/
        DECLARE p_count INT;
        DECLARE id_pet_pac INT; /* PK de pet_pacote */
        DECLARE id_pet_cliente INT;  /* PK de tabela "pet" */
        DECLARE pet_found INT; /* id_pet, se encontrado na busca pelo update */
        DECLARE arrayPetPac JSON;

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_info_object CONDITION FOR SQLSTATE '45001';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';
        DECLARE err_not_array CONDITION FOR SQLSTATE '45003';

        -- Validação geral
        IF JSON_TYPE(objPac) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        -- Validaçao dos dias do pacote ("diasPacote")
        SET arrayObjDiaPac = JSON_EXTRACT(objPac, '$.diasPacote');
        IF (arrayObjDiaPac IS NOT NULL) AND JSON_TYPE(arrayObjDiaPac) <> "ARRAY" THEN
            SIGNAL err_not_array SET MESSAGE_TEXT = 'Dias do pacote devem ser nulo ou do tipo Array';
        END IF;

        -- Validaçao dos pets do pacote ("petsPacote")
        SET arrayObjPetPac = JSON_EXTRACT(objPac, '$.petsPacote');
        IF (arrayObjPetPac IS NOT NULL) AND JSON_TYPE(arrayObjPetPac) <> "ARRAY" THEN
            SIGNAL err_not_array SET MESSAGE_TEXT = 'Pets do pacote devem ser nulo ou do tipo Array';
        END IF;

        SET id_serv_ofer = JSON_EXTRACT(objPac, '$.servicoOferecido');
        SET dt_ini = CAST(JSON_UNQUOTE(JSON_EXTRACT(objPac, '$.dtInicio')) AS DATETIME); /* Validação é feita por trigger na tabela "pacote_agend" */
        SET hr_agend = CAST(JSON_UNQUOTE(JSON_EXTRACT(objPac, '$.hrAgendada')) AS TIME);
        SET freq = JSON_UNQUOTE(JSON_EXTRACT(objPac, '$.frequencia'));
        SET qtd_rec = JSON_EXTRACT(objPac, '$.qtdRecorrencia');

        -- Processos para inserção de pacote_agend
        IF acao = "insert" THEN
            -- Inserção do pacote_agend
            INSERT INTO pacote_agend (
                id_servico_oferecido, dt_inicio, hr_agendada, frequencia, qtd_recorrencia)
                VALUE (id_serv_ofer, dt_ini, hr_agend, freq, qtd_rec);
            SET id_pac = LAST_INSERT_ID();

            -- Loop de inserção de dia_pac
            SET d_count = 0;
            SET d_length = JSON_LENGTH(arrayObjDiaPac);

            WHILE d_count < d_length DO
                -- Obtem objeto da array
                SET dia_pac = JSON_EXTRACT(arrayObjDiaPac, CONCAT('$[', d_count, '].dia'));

                INSERT INTO dia_pacote (id_pacote_agend, dia) VALUE (id_pac, dia_pac);

                SET d_count = d_count + 1;
            END WHILE;

            -- Loop de inserção de pet_pacote
            SET p_count = 0;
            SET p_length = JSON_LENGTH(arrayObjPetPac);
            WHILE p_count < p_length DO
                -- Obtem objeto da array
                SET id_pet_cliente = JSON_EXTRACT(arrayObjPetPac, CONCAT('$[', p_count, '].pet'));

                INSERT INTO pet_pacote (id_pacote_agend, id_pet) VALUE (id_pac, id_pet_cliente);

                SET p_count = p_count + 1;
            END WHILE;
            SELECT id_pac AS id_pacote_agendamento;
        ELSEIF acao IN ("update", "delete") THEN
            SET id_pac = JSON_EXTRACT(objPac, '$.id');

            IF id_pac IS NULL THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de pacote_agend para acao";
            END IF;

            -- Buscando se existe algum pacote_agend correspondente já existente
            SELECT id
                INTO pac_found
                FROM pacote_agend
                WHERE id = id_pac;

            IF pac_found IS NULL THEN
                SIGNAL err_no_for_id_update
                    SET MESSAGE_TEXT = "Nao foi encontrado pacote_agend existente para acao";
            ELSE
                CASE acao
                    WHEN "update" THEN
                        UPDATE pacote_agend
                            SET
                                id_servico_oferecido = id_serv_ofer,   /* Implementar trigger que atualiza serviço escolhido nos agendamentos criados */
                                dt_inicio = dt_ini,
                                hr_agendada = hr_agend,   /* Implementar trigger que atualiza serviço escolhido nos agendamentos criados */
                                qtd_recorrencia = qtd_rec  /* Implementar trigger para cancelar ou excluir agendamentos que sobrarem ao diminuir ou adicionar agendamentos ao aumentar */
                            WHERE id = id_pac;

                        -- Loop de atualização de dia_pac
                        SET d_count = 0;
                        SET d_length = JSON_LENGTH(arrayObjDiaPac);
                        IF (arrayObjDiaPac IS NOT NULL) THEN /* Se dias de recorrência deverão ser atualizadas */
                            SET arrayDiaPac = JSON_ARRAY();

                            -- Cria array json com inteiros representando os dias e atualiza os registros dos dias do pacote
                            WHILE d_count < d_length DO
                                -- Obtem objeto da array
                                SET id_dia_pac = JSON_EXTRACT(arrayObjDiaPac, CONCAT('$[', d_count, '].id'));
                                SET dia_pac = JSON_EXTRACT(arrayObjDiaPac, CONCAT('$[', d_count, '].dia'));

                                IF id_dia_pac IS NULL THEN
                                    INSERT INTO dia_pacote (id_pacote_agend, dia) VALUE (id_pac, dia_pac);
                                    SET id_dia_pac = LAST_INSERT_ID();
                                END IF;

                                UPDATE dia_pacote SET dia = dia_pac WHERE id = id_dia_pac;

                                SET arrayDiaPac = JSON_ARRAY_INSERT(arrayDiaPac, '$[0]', id_dia_pac);

                                SET d_count = d_count + 1;
                            END WHILE;

                            -- Apagando dias omitidos da array
                            DELETE FROM dia_pacote
                                WHERE
                                    id_pacote_agend = id_pac
                                    AND (JSON_CONTAINS(arrayDiaPac, id)) IS NOT TRUE;   /* Implementar trigger que cancela agendamentos futuros não preparados */

                        END IF;

                        -- Loop de atualizacao de pet_pacote
                        SET p_count = 0;
                        SET p_length = JSON_LENGTH(arrayObjPetPac);
                        IF (arrayObjPetPac IS NOT NULL) THEN /* Se pets deverão ser atualizadas */
                            SET arrayPetPac = JSON_ARRAY();

                            -- Cria array json com inteiros representando os IDs de tabela "pet_pacote" e atualiza os registros dos pets do pacote
                            WHILE p_count < p_length DO
                                -- Obtem objeto da array
                                SET id_pet_pac = JSON_EXTRACT(arrayObjPetPac, CONCAT('$[', p_count, '].id'));
                                SET id_pet_cliente = JSON_EXTRACT(arrayObjPetPac, CONCAT('$[', p_count, '].pet'));

                                IF id_pet_pac IS NULL THEN
                                    INSERT INTO pet_pacote (id_pacote_agend, id_pet) VALUE (id_pac, id_pet_cliente);
                                    SET id_pet_pac = LAST_INSERT_ID();
                                END IF;

                                UPDATE pet_pacote SET id_pet = id_pet_cliente WHERE id = id_pet_pac;

                                SET arrayPetPac = JSON_ARRAY_INSERT(arrayPetPac, '$[0]', id_pet_pac);

                                SET p_count = p_count + 1;
                            END WHILE;

                            -- Apagando pets omitidos da array
                            DELETE FROM pet_pacote
                                WHERE
                                    id_pacote_agend = id_pac
                                    AND (JSON_CONTAINS(arrayPetPac, id)) IS NOT TRUE;   /* Implementar trigger que cancela agendamentos futuros não preparados */

                        END IF;
                    WHEN "delete" THEN
                        DELETE FROM pacote_agend WHERE id = id_pac; /* refential action nas tabelas dias e pets garantem a exclusão delas */
                END CASE;
            END IF;
        END IF;
    END;$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE set_estado_pacote_agend(
    IN est ENUM("criado", "preparado", "ativo", "concluido", "cancelado"),
    IN id_pac INT
    )
    COMMENT 'Define um novo estado para o pacote de agendamento'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        UPDATE pacote_agend SET estado = est WHERE id = id_pac;
    END;$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE get_valores_info_servico(
        IN NEW_id_info_serv INT,
        INOUT NEW_valor_servico DECIMAL(8,2),
        INOUT NEW_valor_total DECIMAL(8,2)
    )
    BEGIN
        DECLARE tipo_p VARCHAR(16); /* Valor da coluna "tipo_preco" */
        DECLARE p DECIMAL(8,2); /* Valor de cobrança do serviço (coluna "preco") */
        DECLARE valor_pet_total DECIMAL(8,2); /* Valor a ser inserido na coluna "valor_total"
                                            , caso ele deva ser totalizado
                                            por meio dos "valor_pet" contidos em "pet_servico"*/

        DECLARE info_serv_found INT;

        DECLARE err_info_serv_not_found CONDITION FOR SQLSTATE '45001';

        SELECT id INTO info_serv_found FROM info_servico WHERE id = NEW_id_info_serv;

        -- Verifica se id de info_servico existe
        IF info_serv_found IS NULL THEN
            SIGNAL err_info_serv_not_found
                SET MESSAGE_TEXT = "Id de info_servico nao existente";
        END IF;

        SELECT
            preco, tipo_preco
        INTO p, tipo_p
        FROM servico_oferecido
        WHERE id = (SELECT id_servico_oferecido FROM info_servico WHERE id = NEW_id_info_serv);

        IF tipo_p = "servico" THEN
            SET NEW_valor_servico = p;
            SET NEW_valor_total = p;
        ELSEIF tipo_p = "pet" THEN
            -- Totalizar o "valor_total" usando valores dos registros associados na tabela "pet_servico"
            SELECT SUM(valor_pet) as soma_valor_pet
            INTO valor_pet_total
            FROM pet_servico
            WHERE
                id_info_servico = NEW_id_info_serv
                AND valor_pet IS NOT NULL
            GROUP BY id_info_servico;

            SET NEW_valor_servico = NULL;
            SET NEW_valor_total = valor_pet_total;
        END IF;
    END;$$
DELIMITER ;


DELIMITER $
CREATE PROCEDURE relatorio_simples_financeiro (
    IN periodo ENUM('mensal', 'anual'),
    IN dt_hr_inicio DATETIME,
    IN dt_hr_fim DATETIME
)
    NOT DETERMINISTIC
    READS SQL DATA
BEGIN
    DECLARE err_cotas_insuficiente CONDITION FOR SQLSTATE '45001';

    IF dbo.validar_cotas("relatorio-simples") = FALSE THEN
        SIGNAL err_cotas_insuficiente SET MESSAGE_TEXT = "Cotas insuficientes para geração de relatório simples";
    END IF;
    
    SET SESSION sql_mode = 'TRADITIONAL';
    SET @periodo = periodo;
    
    SET @dt_hr_inicio = dt_hr_inicio;
    SET @dt_hr_fim = dt_hr_fim;

    SET @periodo_grp_by_serv = CASE @periodo 
        WHEN 'mensal' THEN 'ano_serv, mes_serv' 
        WHEN 'anual' THEN 'ano_serv'
        ELSE 'ano_serv, s.mes_serv' END;
    
    SET @periodo_grp_by_desp = CASE @periodo 
        WHEN 'mensal' THEN 'ano_desp, mes_desp' 
        WHEN 'anual' THEN 'ano_desp'
        ELSE 'ano_desp, s.mes_desp' END;
    
    SET @periodo_on_join = CASE @periodo 
        WHEN 'mensal' THEN 'd.ano_desp = s.ano_serv AND d.mes_desp = s.mes_serv' 
        WHEN 'anual' THEN 'd.ano_desp = s.ano_serv' 
        ELSE 'd.ano_desp = s.ano_serv AND d.mes_desp = s.mes_serv' END;
    
    SET @inicio_periodo = CASE @periodo
        WHEN 'mensal' THEN 'DATE_ADD( MAKEDATE(grp_cte.ano, 1), INTERVAL (grp_cte.mes - 1) MONTH )'
        WHEN 'anual' THEN 'MAKEDATE(grp_cte.ano, 1)'
        ELSE '' END;

    SET @fim_periodo = CASE @periodo
        WHEN 'mensal' THEN 'DATE_SUB( DATE_ADD( MAKEDATE(grp_cte.ano, 1), INTERVAL (grp_cte.mes) MONTH ), INTERVAL 1 DAY)'
        WHEN 'anual' THEN 'DATE_SUB( DATE_ADD( MAKEDATE(grp_cte.ano, 1), INTERVAL 1 YEAR ), INTERVAL 1 DAY )'
        ELSE '' END;
    
    SET @stmt = CONCAT('
        WITH
            serv_cte AS (
                SELECT 
                    COUNT(id_servico_realizado) AS qtd_serv_periodo,
                    MONTH(dt_hr_fim) AS mes_serv,
                    YEAR(dt_hr_fim) AS ano_serv,
                    SUM(IFNULL(valor_total, 0)) AS total_periodo
                FROM vw_servico_realizado
                WHERE dt_hr_fim BETWEEN ? AND ?
                GROUP BY ', @periodo_grp_by_serv,'
            ),
            desp_cte AS (
                SELECT 
                    COUNT(id) AS qtd_desp_periodo,
                    MONTH(data) AS mes_desp,
                    YEAR(data) AS ano_desp,
                    SUM(IFNULL(valor, 0)) AS desp_periodo
                FROM despesa
                WHERE data BETWEEN ? AND ?
                GROUP BY ', @periodo_grp_by_desp,'
            ),
            full_cte AS (
                SELECT * FROM serv_cte s LEFT JOIN desp_cte d ON (',@periodo_on_join,')
                UNION 
                SELECT * FROM serv_cte s RIGHT JOIN desp_cte d ON (',@periodo_on_join,')
            ),
            grp_cte AS (
                SELECT 
                    IFNULL(f.mes_serv, f.mes_desp) AS mes,
                    IFNULL(f.ano_serv, f.ano_desp) AS ano,
                    IFNULL(f.qtd_serv_periodo, 0) AS qtd_serv_periodo,
                    IFNULL(f.total_periodo, 0) AS bruto_periodo,
                    IFNULL(f.qtd_desp_periodo, 0) AS qtd_desp_periodo,
                    IFNULL(f.desp_periodo, 0) AS desp_periodo,
                    IFNULL(f.total_periodo, 0) - IFNULL(f.desp_periodo, 0) AS liquido_periodo
                FROM full_cte f
                ORDER BY ano ASC, mes ASC
            )
        SELECT 
            ', @inicio_periodo ,' AS inicio_periodo,
            ', @fim_periodo ,' AS fim_periodo,
            grp_cte.qtd_serv_periodo,
            grp_cte.bruto_periodo,
            grp_cte.qtd_desp_periodo,
            grp_cte.desp_periodo,
            grp_cte.liquido_periodo,
            SUM(qtd_serv_periodo) OVER() AS qtd_serv_total,
            SUM(qtd_desp_periodo) OVER() AS qtd_desp_total,
            AVG(bruto_periodo) OVER() AS media_bruto_periodo,
            SUM(bruto_periodo) OVER() AS bruto_total,
            AVG(desp_periodo) OVER() AS media_desp_periodo,
            SUM(desp_periodo) OVER() AS desp_total,
            AVG(liquido_periodo) OVER() AS media_liquido_periodo,
            SUM(liquido_periodo) OVER() AS liquido_total
        FROM grp_cte');

    PREPARE report_fin FROM @stmt;
    
    EXECUTE report_fin 
        USING 
        @dt_hr_inicio, @dt_hr_fim, 
        @dt_hr_inicio, @dt_hr_fim;
    
    DEALLOCATE PREPARE report_fin;
END;$$
DELIMITER ;
    
DELIMITER $
CREATE PROCEDURE relatorio_detalhado_servico_oferecido (
    IN inicio DATETIME,
    IN fim DATETIME
)
BEGIN
    DECLARE err_cotas_insuficiente CONDITION FOR SQLSTATE '45001';

    IF dbo.validar_cotas("relatorio-detalhado") = FALSE THEN
        SIGNAL err_cotas_insuficiente SET MESSAGE_TEXT = "Cotas insuficientes para geração de relatório detalhado";
    END IF;
    
    SET SESSION sql_mode = 'TRADITIONAL';

    SET @inicio = inicio;
    SET @fim = fim;

    WITH 
        s_cte AS (
            SELECT 
                id_servico_oferecido,
                COUNT(id_servico_oferecido) qtd_serv_periodo,
                AVG(valor_total) media_valor,
                SUM(valor_total) soma_valor
            FROM vw_servico_realizado
            WHERE 
                dt_hr_fim BETWEEN @inicio AND @fim
            GROUP BY 
                id_servico_oferecido
        )
    SELECT 
        s.id_servico_oferecido,
        s.nome,
        s.id_categoria,
        s.nome_categoria,
        s.preco,
        @inicio AS inicio_periodo,
        @fim AS fim_periodo,
        IFNULL(s_c.qtd_serv_periodo, 0) AS qtd_serv_periodo,
        IFNULL(s_c.media_valor, 0) AS media_valor,
        IFNULL(s_c.soma_valor, 0) AS soma_valor
    FROM vw_servico_oferecido s 
        LEFT JOIN s_cte s_c ON (s_c.id_servico_oferecido = s.id_servico_oferecido)
    ORDER BY soma_valor DESC, media_valor DESC, nome ASC, nome_categoria ASC, preco DESC;

END;$$
DELIMITER ;

-- EVENTS =============================================================================================================================================

SET GLOBAL event_scheduler=ON;

DELIMITER $$
CREATE EVENT agendamento_set_estado_pendente
    ON SCHEDULE EVERY 1 MINUTE
    ON COMPLETION PRESERVE
    COMMENT 'Verifica agendamentos que passaram da data agendada e com estado "preparado" e altera para "pendente"'
    DO BEGIN
        UPDATE agendamento
            SET estado = "pendente"
            WHERE
                dt_hr_marcada < CURRENT_TIMESTAMP()
                AND estado = "preparado";
    END;$$
DELIMITER ;


-- FINALIZAÇÃO ========================================================================================================================================
SET foreign_key_checks = ON;


-- DADOS ========================================================

INSERT INTO especie (nome) VALUES
    ("Cão"),
    ("Gato"),
    ("Periquito"),
    ("Porquinho-da-Índia"),
    ("Hamster"),
    ("Coelho"),
    ("Papagaio"),
    ("Capivara"),
    ("Macaco");

INSERT INTO categoria_servico (nome) VALUES
    ("Pet Sitting"),
    ("Passeio"),
    ("Saúde"),
    ("Transporte"),
    ("Hospedagem"),
    ("Creche"),
    ("PetCare");

