CREATE OR REPLACE VIEW vw_restricao_especie_servico AS 
    SELECT
        s_o.id AS id_servico_oferecido,
        s_o.nome AS nome,
        r_e.id_especie,
        e.nome AS nome_especie
    FROM
        restricao_especie AS r_e
        INNER JOIN servico_oferecido AS s_o ON (s_o.id = r_e.id_servico_oferecido)
        INNER JOIN especie AS e ON (e.id = r_e.id_especie);
