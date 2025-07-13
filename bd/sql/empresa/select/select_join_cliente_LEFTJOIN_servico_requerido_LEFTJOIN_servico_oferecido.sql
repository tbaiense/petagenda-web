SELECT
    c.id AS id_cliente,
    c.nome AS nome_cliente,
    c.telefone AS telefone_cliente,
    sr.id_servico_oferecido AS id_servico_requerido_cliente,
    so.nome AS nome_servico_requerido
FROM
    cliente c
    LEFT JOIN servico_requerido sr ON (sr.id_cliente = c.id)
    LEFT JOIN servico_oferecido so ON (so.id = sr.id_servico_oferecido)
ORDER BY
    c.nome ASC,
    so.nome ASC;

