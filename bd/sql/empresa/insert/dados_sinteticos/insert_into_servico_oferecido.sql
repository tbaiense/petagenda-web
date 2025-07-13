INSERT INTO servico_oferecido (nome, preco, tipo_preco, id_categoria, restricao_participante) VALUES
    ("Passeio para cães", 50.00, "pet", 2, "coletivo"),
    ("Passeio para gatos", 45.00, "pet", 2, "coletivo"),
    ("Pet Sitting para cães", 120.00, "pet", 1, "individual"),
    ("Pet Sitting para gatos", 110.00, "pet", 1, "individual"),
    ("Consulta veterinária", 90.00, "pet", 3, "individual"),
    ("Banho e tosa", 45.00, "pet", 7, "individual");
    

INSERT INTO restricao_especie (id_servico_oferecido, id_especie) VALUES
    (1, 1),
    (2, 2),
    (3, 1),
    (4, 2);
