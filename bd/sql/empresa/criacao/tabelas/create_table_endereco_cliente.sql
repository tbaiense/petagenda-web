CREATE TABLE endereco_cliente (
    id_cliente INT NOT NULL PRIMARY KEY,
    logradouro VARCHAR(128) NOT NULL,
    numero VARCHAR(16) NOT NULL,
    bairro VARCHAR(64) NOT NULL,
    cidade VARCHAR(64) NOT NULL,
    estado CHAR(2) NOT NULL DEFAULT "ES",
    
    FOREIGN KEY (id_cliente) REFERENCES cliente(id) ON DELETE CASCADE
);
