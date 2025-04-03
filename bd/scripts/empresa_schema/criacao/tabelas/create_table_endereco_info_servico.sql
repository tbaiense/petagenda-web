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
