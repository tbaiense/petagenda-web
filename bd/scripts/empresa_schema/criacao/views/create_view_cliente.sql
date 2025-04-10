CREATE OR REPLACE VIEW vw_cliente AS
    SELECT
        c.id AS id_cliente,
        c.nome AS nome,
        c.telefone AS telefone,
        e_c.logradouro AS logradouro_end,
        e_c.numero AS numero_end,
        e_c.bairro AS bairro_end,
        e_c.cidade AS cidade_end,
        e_c.estado AS estado_end
    FROM cliente AS c
        LEFT JOIN endereco_cliente AS e_c ON (e_c.id_cliente = c.id);
