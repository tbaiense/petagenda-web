CREATE OR REPLACE VIEW vw_pet AS
    SELECT
        p_c.id AS id_pet,
        p_c.nome AS nome,
        c.id AS id_cliente,
        c.nome AS nome_cliente,
        e.id AS id_especie,
        e.nome AS nome_especie,
        p_c.raca AS raca,
        p_c.porte AS porte,
        p_c.cor AS cor,
        p_c.sexo AS sexo,
        p_c.e_castrado AS e_castrado,
        p_c.cartao_vacina AS cartao_vacina,
        p_c.estado_saude AS estado_saude,
        p_c.comportamento AS comportamento
    FROM pet AS p_c
        INNER JOIN cliente AS c ON (c.id = p_c.id_cliente)
        LEFT JOIN especie AS e ON (e.id = p_c.id_especie)
    ORDER BY id_pet;
