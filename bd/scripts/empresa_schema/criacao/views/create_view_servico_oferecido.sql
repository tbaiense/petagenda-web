CREATE OR REPLACE VIEW vw_servico_oferecido AS 
    SELECT
        s_o.id AS id_servico_oferecido,
        s_o.nome AS nome,
        s_o.preco AS preco,
        s_o.tipo_preco AS tipo_preco,
        s_o.id_categoria AS id_categoria,
        c_s.nome AS nome_categoria,
        s_o.descricao AS descricao,
        s_o.foto AS foto,
        s_o.restricao_participante AS restricao_participante,
        COUNT(r_e.id_servico_oferecido) AS qtd_restr_especie
    FROM
        servico_oferecido AS s_o
        LEFT JOIN categoria_servico AS c_s ON (c_s.id = s_o.id_categoria)
        LEFT JOIN restricao_especie AS r_e ON (r_e.id_servico_oferecido = s_o.id)
        LEFT JOIN especie AS e ON (e.id = r_e.id_especie)
    GROUP BY s_o.id
    ORDER BY nome ASC, preco ASC;
