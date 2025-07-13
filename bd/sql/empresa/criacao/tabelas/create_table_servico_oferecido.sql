CREATE TABLE servico_oferecido (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(64) NOT NULL,
    preco DECIMAL(8,2) NOT NULL DEFAULT 0,
    tipo_preco ENUM("pet", "servico") NOT NULL DEFAULT "pet",
    id_categoria INT NOT NULL,
    descricao TEXT,
    foto TEXT,
    restricao_participante ENUM("coletivo", "individual") NOT NULL DEFAULT "coletivo",
    
	CONSTRAINT chk_servico_oferecido_preco CHECK (preco >= 0),
    FOREIGN KEY (id_categoria) REFERENCES categoria_servico(id)
);