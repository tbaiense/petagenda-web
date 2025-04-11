CREATE OR REPLACE VIEW vw_funcionario AS
    SELECT
        f.id AS id_funcionario,
        f.nome,
        f.telefone,
        COUNT(s_e.id_funcionario) AS qtd_servico_exercido
    FROM funcionario AS f
        LEFT JOIN servico_exercido AS s_e ON (s_e.id_funcionario = f.id)
    GROUP BY f.id
    ORDER BY nome ASC, qtd_servico_exercido ASC;
