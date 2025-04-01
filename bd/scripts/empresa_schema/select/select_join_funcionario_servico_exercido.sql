SELECT 
    f.id AS id_funcionario,
    f.nome AS nome_funcionario,
    se.id_servico_oferecido AS id_servico_exercido,
    s.nome AS servico_exercido
FROM
    funcionario AS f
    INNER JOIN
    servico_exercido AS se ON (se.id_funcionario = f.id)
    INNER JOIN
    servico_oferecido AS s ON (s.id = se.id_servico_oferecido)
ORDER BY f.id ASC, s.nome ASC;
