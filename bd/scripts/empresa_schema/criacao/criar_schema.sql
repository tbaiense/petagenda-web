-- SCHEMA
CREATE SCHEMA 
    empresa_teste 
    CHARACTER SET utf8mb4;

USE empresa_teste;

-- SETUP
SET foreign_key_checks = OFF;

-- TABELAS

CREATE TABLE funcionario (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(64) NOT NULL,
    telefone CHAR(15) NOT NULL
);

CREATE TABLE reserva_funcionario(
    id_funcionario INT NOT NULL,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    
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
    
    FOREIGN KEY (id_cliente) REFERENCES cliente(id)
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
    id_cliente INT NOT NULL,
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
    
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_especie) REFERENCES especie(id)
);

CREATE TABLE info_servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_servico_oferecido INT NOT NULL,
    id_funcionario INT,
    observacoes VARCHAR(250),

    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id)
);

CREATE TABLE pet_servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_pet INT NOT NULL,
    id_info_servico INT NOT NULL,
    instrucao_alimentacao TEXT,
    valor_pet DECIMAL(7,2),

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
    
    PRIMARY KEY (id_info_servico, tipo),
    FOREIGN KEY (id_info_servico) REFERENCES info_servico(id)
);

CREATE TABLE pacote_agend (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_servico_oferecido INT NOT NULL,
    frequencia ENUM("semanal", "mensal_dia", "mensal_semana_dia") NOT NULL,
    estado ENUM("ativo", "concluido", "cancelado") NOT NULL DEFAULT "ativo",
    
    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id)
);

CREATE TABLE pet_pacote (
    id_pacote_agend INT NOT NULL PRIMARY KEY,
    id_pet INT NOT NULL,
    
    FOREIGN KEY (id_pacote_agend) REFERENCES pacote_agend(id),
    FOREIGN KEY (id_pet) REFERENCES pet(id)
);

CREATE TABLE dia_pacote (
    id_dia_pacote INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_pacote_agend INT NOT NULL,
    dia INT NOT NULL,
    semana INT,
    
    FOREIGN KEY (id_pacote_agend) REFERENCES pacote_agend(id)
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

-- TRIGGERS

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
CREATE TRIGGER trg_pet_servico_insert /* Faz a atribuição do valor do preço do pet, se aplicável */
    BEFORE INSERT
    ON pet_servico
    FOR EACH ROW
    BEGIN
        DECLARE tipo_p VARCHAR(16); /*Tipo da cobrança do serviço*/
        DECLARE p DECIMAL(8,2); /* Preço cobrado pelo serviço */

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
                WHERE
                    id = NEW.id_info_servico LIMIT 1);

        IF tipo_p = 'pet' THEN
            SET NEW.valor_pet = p;
        ELSE
            SET NEW.valor_pet = NULL;
        END IF;
    END;$$
DELIMITER ;



-- PROCEDURES

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
CREATE PROCEDURE ins_servico_realizado (IN obj JSON)
    COMMENT 'Cadastra um serviço realizado, criando as informações secundárias necessárias (info_servico, pet_servico, etc)'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de serviço
        DECLARE id_info_serv INT; /* PK da tabela info_servico*/
        DECLARE id_serv, id_func, enderecos_length INT;
        DECLARE dt_hr_ini, dt_hr_fim DATETIME;
        DECLARE obs  VARCHAR(250);
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
        DECLARE est VARCHAR(2);

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_pets CONDITION FOR SQLSTATE '45001';

        -- Validação

        IF JSON_TYPE(obj) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        ELSEIF JSON_TYPE(JSON_EXTRACT(obj, '$.pets')) <> 'ARRAY' THEN
            SIGNAL err_no_pets SET MESSAGE_TEXT = 'Pets nao sao array';
        ELSEIF JSON_LENGTH(obj, '$.pets') = 0 THEN
            SIGNAL err_no_pets SET MESSAGE_TEXT = 'Array de pets nao pode ser vazia';
        END IF;

        -- Cadastro do info_servico
        SET id_serv = JSON_EXTRACT(obj, '$.servico');
        SET id_func = JSON_EXTRACT(obj, '$.funcionario');
        SET obs = JSON_UNQUOTE(JSON_EXTRACT(obj, '$.observacoes'));
        CALL ins_info_servico(id_serv, id_func, obs);
        SET id_info_serv = LAST_INSERT_ID();

        -- Loop de inserção de pets e remédios
        SET pets_length = JSON_LENGTH(obj, '$.pets');
        WHILE c_pet < pets_length DO
            -- Obtem objeto da array
            SET pet_obj = JSON_EXTRACT(obj, CONCAT('$.pets[', c_pet, ']'));

            SET id_pet = JSON_EXTRACT(pet_obj, '$.id');
            SET alimentacao = JSON_UNQUOTE(JSON_EXTRACT(pet_obj, '$.alimentacao'));
            CALL ins_pet_servico(id_pet, id_info_serv, alimentacao);
            SET id_pet_servico = LAST_INSERT_ID();

            -- Loop de inserção de remédios do pet
            SET c_remedio = 0;
            SET remedios_length = JSON_LENGTH(pet_obj, '$.remedios');
            WHILE c_remedio < remedios_length DO
                SET remedio_obj = JSON_EXTRACT( pet_obj, CONCAT('$.remedios[', c_remedio, ']') );
                SET nome_rem = JSON_EXTRACT(remedio_obj, '$.nome');
                SET instrucoes_rem = JSON_EXTRACT(remedio_obj, '$.instrucoes');

                CALL ins_remedio_pet_servico(id_pet_servico, nome_rem, instrucoes_rem);
                SET c_remedio = c_remedio + 1;
            END WHILE;

            SET c_pet = c_pet + 1;
        END WHILE;

        -- Loop de inserção de endereços (validação é feita por trigger da tabela endereco_info_servico)
        SET endereco_length = JSON_LENGTH(obj, '$.enderecos');
        WHILE c_endereco < endereco_length DO
            SET end_obj =   JSON_EXTRACT( obj, CONCAT('$.enderecos[', c_endereco, ']') );

            SET tipo_end = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.tipo'));
            SET logr = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.logradouro'));
            SET num_end = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.numero'));
            SET bairro = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.bairro'));
            SET cid = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.cidade'));
            SET est = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.estado'));

            CALL ins_endereco_info_servico(id_info_serv, tipo_end, logr, num_end, bairro, cid, est);

            SET c_endereco = c_endereco + 1;
        END WHILE;

        -- Inserção do serviço realizado
        SET dt_hr_ini = CAST( JSON_UNQUOTE(JSON_EXTRACT(obj, '$.inicio')) AS DATETIME );
        SET dt_hr_fim = CAST( JSON_UNQUOTE(JSON_EXTRACT(obj, '$.fim')) AS DATETIME );

        INSERT INTO servico_realizado (id_info_servico, dt_hr_inicio, dt_hr_fim) VALUE (id_info_serv, dt_hr_ini, dt_hr_fim);
    END;$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE ins_agendamento (IN obj JSON)
    COMMENT 'Cadastra um agendamento, criando as informações secundárias necessárias (info_servico, pet_servico, etc)'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de agendamento
        DECLARE id_info_serv INT; /* PK da tabela info_servico*/
        DECLARE id_serv, id_func, enderecos_length, id_pac INT;
        DECLARE dt_hr_marc DATETIME;
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
        DECLARE est VARCHAR(2);

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_pets CONDITION FOR SQLSTATE '45001';

        -- Validação

        IF JSON_TYPE(obj) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        ELSEIF JSON_TYPE(JSON_EXTRACT(obj, '$.pets')) <> 'ARRAY' THEN
            SIGNAL err_no_pets SET MESSAGE_TEXT = 'Pets nao sao array';
        ELSEIF JSON_LENGTH(obj, '$.pets') = 0 THEN
            SIGNAL err_no_pets SET MESSAGE_TEXT = 'Array de pets nao pode ser vazia';
        END IF;

        -- Cadastro do info_servico
        SET id_serv = JSON_EXTRACT(obj, '$.servico');
        SET id_func = JSON_EXTRACT(obj, '$.funcionario');
        SET obs = JSON_UNQUOTE(JSON_EXTRACT(obj, '$.observacoes'));
        CALL ins_info_servico(id_serv, id_func, obs);
        SET id_info_serv = LAST_INSERT_ID();

        -- Loop de inserção de pets e remédios
        SET pets_length = JSON_LENGTH(obj, '$.pets');
        WHILE c_pet < pets_length DO
            -- Obtem objeto da array
            SET pet_obj = JSON_EXTRACT(obj, CONCAT('$.pets[', c_pet, ']'));

            SET id_pet = JSON_EXTRACT(pet_obj, '$.id');
            SET alimentacao = JSON_UNQUOTE(JSON_EXTRACT(pet_obj, '$.alimentacao'));
            CALL ins_pet_servico(id_pet, id_info_serv, alimentacao);
            SET id_pet_servico = LAST_INSERT_ID();

            -- Loop de inserção de remédios do pet
            SET c_remedio = 0;
            SET remedios_length = JSON_LENGTH(pet_obj, '$.remedios');
            WHILE c_remedio < remedios_length DO
                SET remedio_obj = JSON_EXTRACT( pet_obj, CONCAT('$.remedios[', c_remedio, ']') );
                SET nome_rem = JSON_EXTRACT(remedio_obj, '$.nome');
                SET instrucoes_rem = JSON_EXTRACT(remedio_obj, '$.instrucoes');

                CALL ins_remedio_pet_servico(id_pet_servico, nome_rem, instrucoes_rem);
                SET c_remedio = c_remedio + 1;
            END WHILE;

            SET c_pet = c_pet + 1;
        END WHILE;

        -- Loop de inserção de endereços (validação é feita por trigger da tabela endereco_info_servico)
        SET endereco_length = JSON_LENGTH(obj, '$.enderecos');
        WHILE c_endereco < endereco_length DO
            SET end_obj =   JSON_EXTRACT( obj, CONCAT('$.enderecos[', c_endereco, ']') );

            SET tipo_end = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.tipo'));
            SET logr = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.logradouro'));
            SET num_end = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.numero'));
            SET bairro = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.bairro'));
            SET cid = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.cidade'));
            SET est = JSON_UNQUOTE(JSON_EXTRACT(end_obj, '$.estado'));

            CALL ins_endereco_info_servico(id_info_serv, tipo_end, logr, num_end, bairro, cid, est);

            SET c_endereco = c_endereco + 1;
        END WHILE;

        -- Inserção do agendamento
        SET id_pac = JSON_EXTRACT(obj, '$.pacote');
        SET dt_hr_marc = CAST( JSON_UNQUOTE(JSON_EXTRACT(obj, '$.data_hora_marcada')) AS DATETIME );

        INSERT INTO agendamento (id_info_servico, dt_hr_marcada, id_pacote_agend) VALUE (id_info_serv, dt_hr_marc, id_pac);
    END;$$
DELIMITER ;


-- FINALIZAÇÃO
SET foreign_key_checks = ON;
