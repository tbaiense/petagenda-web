/*
SCRIPT DE INSERÇÃO DE DADOS INICIAIS NECESSÁRIOS PARA O FUNCIONAMENTO
*/

SET autocommit = 0;
START TRANSACTION;

INSERT INTO especie (nome) VALUES
    ("Cão"),
    ("Gato"),
    ("Periquito"),
    ("Porquinho-da-Índia"),
    ("Hamster"),
    ("Coelho"),
    ("Papagaio"),
    ("Capivara"),
    ("Macaco");

INSERT INTO categoria_servico (nome) VALUES
    ("Pet Sitting"),
    ("Passeio"),
    ("Saúde"),
    ("Transporte"),
    ("Hospedagem"),
    ("Creche"),
    ("PetCare");

COMMIT;
SET autocommit = 1;
