CREATE TABLE pacote_agend (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_servico_oferecido INT NOT NULL,
    dt_inicio DATE NOT NULL,
    hr_agendada TIME NOT NULL,
    frequencia ENUM("dias_semana", "dias_mes", "dias_ano") NOT NULL,
    estado ENUM("criado", "preparado", "ativo", "concluido", "cancelado") NOT NULL DEFAULT "criado",
    qtd_recorrencia INT NOT NULL,

    CONSTRAINT chk_pacote_agend_qtd_recorrencia CHECK (qtd_recorrencia > 0),
    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id)
);
