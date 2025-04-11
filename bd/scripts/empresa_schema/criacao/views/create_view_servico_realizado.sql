CREATE OR REPLACE VIEW vw_servico_realizado AS
    SELECT 
        s_r.id AS id_servico_realizado,
        s_r.dt_hr_inicio AS dt_hr_inicio,
        s_r.dt_hr_fim AS dt_hr_fim,
        i_s.id AS id_info_servico,
        s_o.id AS id_servico_oferecido,
        s_o.nome AS nome_servico_oferecido,
        s_o.id_categoria AS id_categoria_servico_oferecido,
        c_s.nome AS nome_categoria_servico,
        COUNT(DISTINCT p_s.id_pet) AS qtd_pet_servico,
        s_r.valor_servico AS valor_servico,
        s_r.valor_total AS valor_total,
        i_s.id_funcionario AS id_funcionario,
        f.nome AS nome_funcionario,
        i_s.observacoes AS observacoes
    FROM servico_realizado AS s_r
        INNER JOIN info_servico AS i_s ON (i_s.id = s_r.id_info_servico)
            INNER JOIN servico_oferecido AS s_o ON (s_o.id = i_s.id_servico_oferecido)
                LEFT JOIN categoria_servico AS c_s ON (c_s.id = s_o.id_categoria)
            INNER JOIN funcionario AS f ON (f.id = i_s.id_funcionario)
            INNER JOIN pet_servico AS p_s ON (p_s.id_info_servico = i_s.id)
    GROUP BY s_r.id
    ORDER BY 
        dt_hr_inicio DESC, 
        dt_hr_fim DESC, 
        nome_servico_oferecido ASC, 
        nome_funcionario ASC, 
        valor_total DESC;
