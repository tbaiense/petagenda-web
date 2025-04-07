CREATE TABLE pacote_agend (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_servico_oferecido INT NOT NULL,
    dt_inicio DATE NOT NULL,
    hr_agendada TIME NOT NULL,
    frequencia ENUM("dias_semana", "dias_mes", "dias_ano") NOT NULL,
    estado ENUM("criado", "preparado", "ativo", "concluido", "cancelado") NOT NULL DEFAULT "criado",

    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id)
);
