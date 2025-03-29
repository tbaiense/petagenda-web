CREATE TABLE servico_exercido (
    id_funcionario INT NOT NULL,
    id_servico_oferecido INT NOT NULL,
    
    PRIMARY KEY (id_funcionario, id_servico_oferecido),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id),
    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id)
);