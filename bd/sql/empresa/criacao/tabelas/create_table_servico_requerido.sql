CREATE TABLE servico_requerido (
    id_cliente INT NOT NULL,
    id_servico_oferecido INT NOT NULL,
    
    PRIMARY KEY (id_cliente, id_servico_oferecido),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id)
);