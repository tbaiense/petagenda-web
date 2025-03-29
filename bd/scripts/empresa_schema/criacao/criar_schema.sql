CREATE SCHEMA 
    empresa_teste 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_0900_ai_ci;

SET foreign_key_checks = OFF;

USE empresa_teste;

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
    id_funcionario INT,
    observacoes VARCHAR(250),
    
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id)
);

CREATE TABLE pet_servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_pet INT NOT NULL,
    id_info_servico INT NOT NULL,
    instrucao_alimentacao TEXT,
    
    FOREIGN KEY (id_pet) REFERENCES pet(id),
    FOREIGN KEY (id_info_servico) REFERENCES info_servico(id)
);

CREATE TABLE remedio_pet_servico (
    id_pet_servico INT NOT NULL PRIMARY KEY,
    nome VARCHAR(128) NOT NULL,
    instrucoes TEXT NOT NULL,
    
    FOREIGN KEY (id_pet_servico) REFERENCES pet_servico(id)
); 

CREATE TABLE endereco_info_servico (
    id_info_servico INT NOT NULL PRIMARY KEY,
    tipo ENUM("buscar", "devolver") NOT NULL,
    logradouro VARCHAR(128) NOT NULL,
    numero VARCHAR(16) NOT NULL,
    bairo VARCHAR(64) NOT NULL,
    cidade VARCHAR(64) NOT NULL,
    estado CHAR(2) NOT NULL DEFAULT "ES",
    
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
    id_info_servico INT NOT NULL,
    dt_hr_fim DATETIME NOT NULL,
    dt_hr_inicio DATETIME,
    
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
    
    FOREIGN KEY (id_info_servico) REFERENCES info_servico(id),
    FOREIGN KEY (id_pacote_agend) REFERENCES pacote_agend(id),
    FOREIGN KEY (id_servico_realizado) REFERENCES servico_realizado(id)
);










