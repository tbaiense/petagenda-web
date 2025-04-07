CREATE TABLE dia_pacote (
    id_dia_pacote INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_pacote_agend INT NOT NULL,
    dia INT NOT NULL,
    
    FOREIGN KEY (id_pacote_agend) REFERENCES pacote_agend(id)
);
