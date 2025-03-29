CREATE TABLE endereco_empresa (
    id_empresa INT NOT NULL PRIMARY KEY,
    logradouro VARCHAR(128) NOT NULL,
    numero VARCHAR(16) NOT NULL,
    bairro VARCHAR(64) NOT NULL,
    cidade VARCHAR(64) NOT NULL,
    estado CHAR(2) NOT NULL,
    
    FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);
