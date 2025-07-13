CREATE TABLE pet_servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_pet INT NOT NULL,
    id_info_servico INT NOT NULL,
    instrucao_alimentacao TEXT,
    valor_pet DECIMAL(8,2),

	CONSTRAINT chk_pet_servico_valor_pet CHECK (valor_pet >= 0),
    UNIQUE (id_pet, id_info_servico),
    FOREIGN KEY (id_pet) REFERENCES pet(id),
    FOREIGN KEY (id_info_servico) REFERENCES info_servico(id)
);
