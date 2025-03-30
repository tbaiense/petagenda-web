SELECT 
    i.id AS id_info_servico,
    pis.id_pet AS id_pet,
    p.nome AS nome_pet,
    p.id_cliente AS id_cliente,
    c.nome AS nome_cliente
FROM
    info_servico AS i
    INNER JOIN
    pet_servico AS pis ON (pis.id_info_servico = i.id)
    INNER JOIN
    pet AS p ON (p.id = pis.id_pet)
    INNER JOIN
    cliente AS c ON (c.id = p.id_cliente)
ORDER BY i.id ASC, pis.id_pet ASC; 
