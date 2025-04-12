CREATE OR REPLACE VIEW vw_agendamento AS
    SELECT
        a.id AS id_agendamento,
        a.dt_hr_marcada AS dt_hr_marcada,
        a.estado AS estado,
        i_s.*
    FROM agendamento AS a
        INNER JOIN vw_info_servico AS i_s ON (i_s.id_info_servico = a.id_info_servico)
    ORDER BY
        id_agendamento DESC;
