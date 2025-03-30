CREATE TABLE info_servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_funcionario INT,
    observacoes VARCHAR(250),
    end_pet_buscar_devolver_igual ENUM("S", "N"),
    
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id)
);