CREATE OR REPLACE VIEW vw_agendamento AS
    SELECT
        COUNT(a.id) OVER() AS qtd_agendamento,
        a.id AS id_agendamento,
        a.dt_hr_marcada AS dt_hr_marcada,
        a.estado AS estado,
        a.id_pacote_agend AS id_pacote_agend,
        a.valor_servico AS valor_servico,
        a.valor_total AS valor_total,
        a.id_servico_realizado AS id_servico_realizado,
        i_s.*
    FROM agendamento AS a
        INNER JOIN vw_info_servico AS i_s ON (i_s.id_info_servico = a.id_info_servico)
    ORDER BY
        id_agendamento DESC;