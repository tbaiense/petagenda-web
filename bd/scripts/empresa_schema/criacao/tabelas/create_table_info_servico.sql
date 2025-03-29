CREATE TABLE info_servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_funcionario INT,
    observacoes VARCHAR(250),
    
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id)
);