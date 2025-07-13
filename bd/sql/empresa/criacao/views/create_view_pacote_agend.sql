CREATE OR REPLACE VIEW vw_pacote_agend AS
	SELECT
		p_a.id AS id_pacote_agend,
		p_a.dt_inicio AS dt_inicio,
		p_a.hr_agendada AS hr_agendada,
		p_a.frequencia AS frequencia,
		p_a.estado AS estado,
		p_a.qtd_recorrencia AS qtd_recorrencia,
		COUNT(DISTINCT d_p.id) AS qtd_dia_pacote,
		COUNT(DISTINCT a.id) AS qtd_agendamento,
		s_o.id AS id_servico_oferecido,
		s_o.nome AS nome_servico_oferecido,
		s_o.id_categoria AS id_categoria_servico_oferecido,
		c_s.nome AS nome_categoria_servico,
		COUNT(DISTINCT p_p.id_pet) AS qtd_pet_pacote
	FROM pacote_agend AS p_a
		INNER JOIN servico_oferecido AS s_o ON (s_o.id = p_a.id_servico_oferecido)
			LEFT JOIN categoria_servico AS c_s ON (c_s.id = s_o.id_categoria)
		INNER JOIN dia_pacote AS d_p ON (d_p.id_pacote_agend = p_a.id)
		INNER JOIN pet_pacote AS p_p ON (p_p.id_pacote_agend = p_a.id)
		LEFT JOIN agendamento AS a ON (a.id_pacote_agend = p_a.id)
	GROUP BY id_pacote_agend;