CREATE TABLE remedio_pet_servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_pet_servico INT NOT NULL,
    nome VARCHAR(128) NOT NULL,
    instrucoes TEXT NOT NULL,
    
    UNIQUE (id_pet_servico, nome),
    FOREIGN KEY (id_pet_servico) REFERENCES pet_servico(id)
);
