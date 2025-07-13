CREATE OR REPLACE VIEW vw_cliente AS
    SELECT
        c.id AS id_cliente,
        c.nome AS nome,
        c.telefone AS telefone,
        e_c.logradouro AS logradouro_end,
        e_c.numero AS numero_end,
        e_c.bairro AS bairro_end,
        e_c.cidade AS cidade_end,
        e_c.estado AS estado_end,
        COUNT(s_r.id_servico_oferecido) AS qtd_servico_requerido
    FROM cliente AS c
        LEFT JOIN endereco_cliente AS e_c ON (e_c.id_cliente = c.id)
        LEFT JOIN servico_requerido AS s_r ON (s_r.id_cliente = c.id)
    GROUP BY c.id
    ORDER BY nome ASC, telefone DESC, qtd_servico_requerido DESC;
