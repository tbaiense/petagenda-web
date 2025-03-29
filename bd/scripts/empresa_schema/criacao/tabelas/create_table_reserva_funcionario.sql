CREATE TABLE reserva_funcionario(
    id_funcionario INT NOT NULL,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id)
);