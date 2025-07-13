CREATE TABLE servico_realizado (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_info_servico INT NOT NULL UNIQUE,
    dt_hr_fim DATETIME NOT NULL,
    dt_hr_inicio DATETIME,
    valor_servico DECIMAL(8,2),
    valor_total DECIMAL(8,2),

    CONSTRAINT chk_servico_realizado_valor_servico CHECK (valor_servico >= 0),
    CONSTRAINT chk_servico_realizado_valor_total CHECK (valor_total >= 0),
    CONSTRAINT chk_servico_realizado_dt_hr_fim_AND_dt_hr_inicio CHECK (dt_hr_fim > dt_hr_inicio),
    FOREIGN KEY (id_info_servico) REFERENCES info_servico(id)
);
