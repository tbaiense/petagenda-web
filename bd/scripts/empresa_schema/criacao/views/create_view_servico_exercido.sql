CREATE OR REPLACE VIEW vw_servico_exercido AS
    SELECT
        s_e.id_funcionario AS id_funcionario,
        f.nome AS nome_funcionario,
        s_e.id_servico_oferecido AS id_servico_oferecido,
        s_o.nome AS nome_servico,
        s_o.id_categoria AS id_categoria,
        c_s.nome AS nome_categoria,
        s_o.foto AS foto_servico
    FROM
        servico_exercido AS s_e
        INNER JOIN funcionario AS f ON (f.id = s_e.id_funcionario)
        INNER JOIN
        servico_oferecido AS s_o ON (s_o.id = s_e.id_servico_oferecido)
        LEFT JOIN categoria_servico AS c_s ON (c_s.id = s_o.id_categoria)
        ORDER BY id_funcionario ASC, nome_funcionario ASC, nome_servico ASC, nome_categoria ASC;
