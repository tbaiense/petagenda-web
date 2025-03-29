CREATE TABLE pacote_agend (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_servico_oferecido INT NOT NULL,
    frequencia ENUM("semanal", "mensal_dia", "mensal_semana_dia") NOT NULL,
    estado ENUM("ativo", "concluido", "cancelado") NOT NULL DEFAULT "ativo",
    
    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id)
);