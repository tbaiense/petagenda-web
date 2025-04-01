CREATE TABLE info_servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_servico_oferecido INT NOT NULL,
    id_funcionario INT,
    observacoes VARCHAR(250),
    valor_servico DECIMAL(8,2),
    valor_total DECIMAL(8,2) NOT NULL,

	CONSTRAINT chk_info_servico_valor_servico CHECK (valor_servico >= 0),
	CONSTRAINT chk_info_servico_valor_total CHECK (valor_total >= 0),
    FOREIGN KEY (id_servico_oferecido) REFERENCES servico_oferecido(id),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id)
);