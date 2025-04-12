CREATE OR REPLACE VIEW vw_pet_pacote AS
    SELECT
		p_p.id AS id_pet_pacote,
		p_p.id_pacote_agend AS id_pacote_agend,
        p_c.id AS id_pet,
        p_c.nome AS nome,
		e.id AS id_especie,
        e.nome AS nome_especie,
        p_c.raca AS raca,
        p_c.porte AS porte,
        c.id AS id_cliente,
        c.nome AS nome_cliente
    FROM pet_pacote AS p_p
		INNER JOIN pet AS p_c ON (p_c.id = p_p.id_pet)
			LEFT JOIN especie AS e ON (e.id = p_c.id_especie)
			INNER JOIN cliente AS c ON (c.id = p_c.id_cliente)
    ORDER BY id_pacote_agend DESC, nome ASC;
