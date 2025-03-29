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