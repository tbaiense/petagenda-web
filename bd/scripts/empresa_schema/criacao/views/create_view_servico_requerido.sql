CREATE OR REPLACE VIEW vw_servico_requerido AS
    SELECT
        s_r.id_cliente AS id_cliente,
        c.nome AS nome_cliente,
        s_r.id_servico_oferecido AS id_servico_requerido,
        s_o.nome AS nome_servico,
        s_o.id_categoria AS id_cat_serv_ofer,
        c_s.nome AS nome_categoria,
        s_o.foto AS foto_servico
    FROM servico_requerido AS s_r
        INNER JOIN servico_oferecido AS s_o ON (s_o.id = s_r.id_servico_oferecido)
        LEFT JOIN categoria_servico AS c_s ON (c_s.id = s_o.id_categoria)
        INNER JOIN cliente AS c ON (c.id = s_r.id_cliente);
