CREATE TABLE usuario (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_empresa INT,
    email VARCHAR(128) NOT NULL UNIQUE, /* Inserir validação por regex! */
    senha VARCHAR(32) NOT NULL,
    e_admin ENUM("Y", "N") NOT NULL DEFAULT "N",
    perg_seg VARCHAR(64),
    resposta_perg_seg VARCHAR(32),
    
    FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);
