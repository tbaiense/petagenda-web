CREATE TABLE pet_pacote (
    id_pacote_agend INT NOT NULL PRIMARY KEY,
    id_pet INT NOT NULL,
    
    FOREIGN KEY (id_pacote_agend) REFERENCES pacote_agend(id),
    FOREIGN KEY (id_pet) REFERENCES pet(id)
);