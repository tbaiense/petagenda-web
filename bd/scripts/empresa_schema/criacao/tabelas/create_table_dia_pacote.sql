CREATE TABLE dia_pacote (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_pacote_agend INT NOT NULL,
    dia INT NOT NULL,

    UNIQUE (id_pacote_agend, dia),
    FOREIGN KEY (id_pacote_agend) REFERENCES pacote_agend(id) ON DELETE CASCADE
);
