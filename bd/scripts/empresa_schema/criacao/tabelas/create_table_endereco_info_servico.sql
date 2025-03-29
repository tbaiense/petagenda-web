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