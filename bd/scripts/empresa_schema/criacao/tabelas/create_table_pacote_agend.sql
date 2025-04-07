CREATE TABLE pacote_agend (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_servico_oferecido INT NOT NULL,
    dt_inicio DATE NOT NULL,
    hr_agendado TIME NOT NULL,
    frequencia ENUM("dias_semana", "dias_mes", "dias_ano") NOT NULL,
    estado ENUM("ativo", "concluido", "cancelado") NOT NULL DEFAULT "ativo",

    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id)
);
