CREATE TABLE pet_pacote (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_pacote_agend INT NOT NULL,
    id_pet INT NOT NULL,

    UNIQUE (id_pacote_agend, id_pet),
    FOREIGN KEY (id_pacote_agend) REFERENCES pacote_agend(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pet) REFERENCES pet(id)
);
