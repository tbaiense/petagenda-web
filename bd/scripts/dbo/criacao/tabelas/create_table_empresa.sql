CREATE TABLE empresa (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome_bd VARCHAR(32) NOT NULL UNIQUE,
    licenca_empresa ENUM("basico", "profissional"),
    dt_inicio_licenca DATE,
    dt_fim_licenca DATE,
    cota_servico INT NOT NULL DEFAULT 0,
    cota_relatorio_simples INT NOT NULL DEFAULT 0,
    cota_relatorio_detalhado INT NOT NULL DEFAULT 0,
    razao_social VARCHAR(128),
    nome_fantasia VARCHAR(128),
    cnpj CHAR(14) UNIQUE,
    foto TEXT,
    lema VARCHAR(180)
);