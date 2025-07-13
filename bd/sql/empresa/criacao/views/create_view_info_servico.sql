CREATE OR REPLACE VIEW vw_info_servico AS
    SELECT
        i_s.*,
        eb_i_s.tipo AS tipo_endereco_buscar,
        eb_i_s.logradouro AS logradouro_endereco_buscar,
        eb_i_s.numero AS numero_endereco_buscar,
        eb_i_s.bairro AS bairro_endereco_buscar,
        eb_i_s.cidade AS cidade_endereco_buscar,
        eb_i_s.estado AS estado_endereco_buscar,
        ed_i_s.tipo AS tipo_endereco_devolver,
        ed_i_s.logradouro AS logradouro_endereco_devolver,
        ed_i_s.numero AS numero_endereco_devolver,
        ed_i_s.bairro AS bairro_endereco_devolver,
        ed_i_s.cidade AS cidade_endereco_devolver,
        ed_i_s.estado AS estado_endereco_devolver
    FROM (
        SELECT
            i_s.id AS id_info_servico,
            s_o.id AS id_servico_oferecido,
            s_o.nome AS nome_servico_oferecido,
            s_o.id_categoria AS id_categoria_servico_oferecido,
            c_s.nome AS nome_categoria_servico,
            i_s.id_cliente AS id_cliente,
            cli.nome AS nome_cliente,
            COUNT(DISTINCT p_s.id_pet) AS qtd_pet_servico,
            i_s.id_funcionario AS id_funcionario,
            f.nome AS nome_funcionario,
            i_s.observacoes AS observacoes
        FROM info_servico AS i_s
                INNER JOIN servico_oferecido AS s_o ON (s_o.id = i_s.id_servico_oferecido)
                    LEFT JOIN categoria_servico AS c_s ON (c_s.id = s_o.id_categoria)
                INNER JOIN cliente AS cli ON (cli.id = i_s.id_cliente)
                LEFT JOIN funcionario AS f ON (f.id = i_s.id_funcionario)
                LEFT JOIN pet_servico AS p_s ON (p_s.id_info_servico = i_s.id)
        GROUP BY i_s.id
        ORDER BY
            nome_servico_oferecido ASC,
            nome_funcionario ASC
    ) AS i_s
        LEFT JOIN endereco_info_servico AS eb_i_s ON (eb_i_s.id_info_servico = i_s.id_info_servico AND eb_i_s.tipo IN ("buscar", "buscar-devolver"))
        LEFT JOIN endereco_info_servico AS ed_i_s ON (ed_i_s.id_info_servico = i_s.id_info_servico AND ed_i_s.tipo IN ("devolver", "buscar-devolver"));

