CREATE TABLE servico_realizado (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_info_servico INT NOT NULL,
    dt_hr_fim DATETIME NOT NULL,
    dt_hr_inicio DATETIME,
    
    FOREIGN KEY (id_info_servico) REFERENCES info_servico(id)
);
