CREATE TABLE empresa (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome_bd VARCHAR(32) UNIQUE,    /* Gerado automaticamente por trigger */
    licenca_empresa ENUM("basico", "profissional"),  /* Definido por meio de procedimento set_licenca_empresa */
    dt_inicio_licenca DATE,  /* Definido por meio de procedimento set_licenca_empresa */
    dt_fim_licenca DATE,  /* Definido por meio de procedimento set_licenca_empresa */
    cota_servico INT NOT NULL DEFAULT 0,  /* Definido por meio de procedimento set_cotas_empresa */
    cota_relatorio_simples INT NOT NULL DEFAULT 0,  /* Definido por meio de procedimento set_cotas_empresa */
    cota_relatorio_detalhado INT NOT NULL DEFAULT 0,  /* Definido por meio de procedimento set_cotas_empresa */
    razao_social VARCHAR(128),
    nome_fantasia VARCHAR(128),
    cnpj CHAR(14) UNIQUE,   /* TODO: fazer validação por regex */
    foto TEXT,
    lema VARCHAR(180)
);
