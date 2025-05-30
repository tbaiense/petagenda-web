CREATE OR REPLACE VIEW vw_servico_realizado AS
    SELECT 
        s_r.id AS id_servico_realizado,
        s_r.dt_hr_inicio AS dt_hr_inicio,
        s_r.dt_hr_fim AS dt_hr_fim,
        s_r.valor_servico AS valor_servico,
        s_r.valor_total AS valor_total,
        i_s.*
    FROM servico_realizado AS s_r
        INNER JOIN vw_info_servico AS i_s ON (i_s.id_info_servico = s_r.id_info_servico)
    ORDER BY 
        dt_hr_fim DESC;