CREATE TABLE despesa (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    data DATE NOT NULL,
    tipo ENUM("pagamento-funcionario", "prejuizo", "manutencao", "outro") NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
	
	CONSTRAINT chk_despesa_valor CHECK (valor > 0)
);