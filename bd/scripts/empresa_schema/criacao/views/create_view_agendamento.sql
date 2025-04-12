CREATE OR REPLACE VIEW vw_agendamento AS
    SELECT
        a.id AS id_agendamento,
        a.dt_hr_marcada AS dt_hr_marcada,
        a.estado AS estado,
        i_s.id AS id_info_servico,
        s_o.id AS id_servico_oferecido,
        s_o.nome AS nome_servico_oferecido,
        s_o.id_categoria AS id_categoria_servico_oferecido,
        c_s.nome AS nome_categoria_servico,
        COUNT(DISTINCT p_s.id_pet) AS qtd_pet_servico,
        a.valor_servico AS valor_servico,
        a.valor_total AS valor_total,
        i_s.id_funcionario AS id_funcionario,
        f.nome AS nome_funcionario,
        i_s.observacoes AS observacoes,
        a.id_pacote_agend AS id_pacote_agend,
        a.id_servico_realizado AS id_servico_realizado
    FROM agendamento AS a
        INNER JOIN info_servico AS i_s ON (i_s.id = a.id_info_servico)
            INNER JOIN servico_oferecido AS s_o ON (s_o.id = i_s.id_servico_oferecido)
                LEFT JOIN categoria_servico AS c_s ON (c_s.id = s_o.id_categoria)
            LEFT JOIN funcionario AS f ON (f.id = i_s.id_funcionario)
            INNER JOIN pet_servico AS p_s ON (p_s.id_info_servico = i_s.id)
    GROUP BY a.id
    ORDER BY
        id_agendamento DESC;