CREATE TABLE reserva_funcionario(
    id_funcionario INT NOT NULL,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    
	CONSTRAINT chk_reserva_funcionario_hora_inicio_AND_hora_fim CHECK (hora_inicio < hora_fim),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id)
);