CREATE OR REPLACE VIEW vw_pet_servico AS
    SELECT
		p_s.id AS id_pet_servico,
		p_s.id_info_servico AS id_info_servico,
		s_o.nome AS nome_servico,
        p_c.id AS id_pet,
        p_c.nome AS nome,
		e.id AS id_especie,
        e.nome AS nome_especie,
        p_c.raca AS raca,
        p_c.porte AS porte,
        c.id AS id_cliente,
        c.nome AS nome_cliente,
		p_s.valor_pet AS valor_pet,
		p_s.instrucao_alimentacao AS instrucao_alimentacao,
		COUNT(DISTINCT r_p_s.id) AS qtd_remedio_pet_servico
    FROM pet_servico AS p_s
		INNER JOIN pet AS p_c ON (p_c.id = p_s.id_pet)
			LEFT JOIN especie AS e ON (e.id = p_c.id_especie)
			INNER JOIN cliente AS c ON (c.id = p_c.id_cliente)
		INNER JOIN info_servico AS i_s ON (i_s.id = p_s.id_info_servico)
		INNER JOIN servico_oferecido AS s_o ON (s_o.id = i_s.id_servico_oferecido)
		LEFT JOIN remedio_pet_servico AS r_p_s ON (r_p_s.id_pet_servico = p_s.id)
	GROUP BY p_s.id
    ORDER BY id_info_servico DESC, nome ASC;
