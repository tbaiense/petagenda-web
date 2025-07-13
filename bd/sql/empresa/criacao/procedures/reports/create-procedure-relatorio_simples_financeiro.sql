DROP PROCEDURE IF EXISTS relatorio_simples_financeiro;

DELIMITER $
CREATE PROCEDURE relatorio_simples_financeiro (
    IN periodo ENUM('mensal', 'anual'),
    IN dt_hr_inicio DATETIME,
    IN dt_hr_fim DATETIME
)
    NOT DETERMINISTIC
    READS SQL DATA
BEGIN
    SET SESSION sql_mode = 'TRADITIONAL';
    SET @periodo = periodo;
    
    SET @dt_hr_inicio = dt_hr_inicio;
    SET @dt_hr_fim = dt_hr_fim;

    SET @periodo_grp_by_serv = CASE @periodo 
        WHEN 'mensal' THEN 'ano_serv, mes_serv' 
        WHEN 'anual' THEN 'ano_serv'
        ELSE 'ano_serv, s.mes_serv' END;
    
    SET @periodo_grp_by_desp = CASE @periodo 
        WHEN 'mensal' THEN 'ano_desp, mes_desp' 
        WHEN 'anual' THEN 'ano_desp'
        ELSE 'ano_desp, s.mes_desp' END;
    
    SET @periodo_on_join = CASE @periodo 
        WHEN 'mensal' THEN 'd.ano_desp = s.ano_serv AND d.mes_desp = s.mes_serv' 
        WHEN 'anual' THEN 'd.ano_desp = s.ano_serv' 
        ELSE 'd.ano_desp = s.ano_serv AND d.mes_desp = s.mes_serv' END;
    
    SET @inicio_periodo = CASE @periodo
        WHEN 'mensal' THEN 'DATE_ADD( MAKEDATE(grp_cte.ano, 1), INTERVAL (grp_cte.mes - 1) MONTH )'
        WHEN 'anual' THEN 'MAKEDATE(grp_cte.ano, 1)'
        ELSE '' END;

    SET @fim_periodo = CASE @periodo
        WHEN 'mensal' THEN 'DATE_SUB( DATE_ADD( MAKEDATE(grp_cte.ano, 1), INTERVAL (grp_cte.mes) MONTH ), INTERVAL 1 DAY)'
        WHEN 'anual' THEN 'DATE_SUB( DATE_ADD( MAKEDATE(grp_cte.ano, 1), INTERVAL 1 YEAR ), INTERVAL 1 DAY )'
        ELSE '' END;
    
    SET @stmt = CONCAT('
        WITH
            serv_cte AS (
                SELECT 
                    COUNT(id_servico_realizado) AS qtd_serv_periodo,
                    MONTH(dt_hr_fim) AS mes_serv,
                    YEAR(dt_hr_fim) AS ano_serv,
                    SUM(IFNULL(valor_total, 0)) AS total_periodo
                FROM vw_servico_realizado
                WHERE dt_hr_fim BETWEEN ? AND ?
                GROUP BY ', @periodo_grp_by_serv,'
            ),
            desp_cte AS (
                SELECT 
                    COUNT(id) AS qtd_desp_periodo,
                    MONTH(data) AS mes_desp,
                    YEAR(data) AS ano_desp,
                    SUM(IFNULL(valor, 0)) AS desp_periodo
                FROM despesa
                WHERE data BETWEEN ? AND ?
                GROUP BY ', @periodo_grp_by_desp,'
            ),
            full_cte AS (
                SELECT * FROM serv_cte s LEFT JOIN desp_cte d ON (',@periodo_on_join,')
                UNION 
                SELECT * FROM serv_cte s RIGHT JOIN desp_cte d ON (',@periodo_on_join,')
            ),
            grp_cte AS (
                SELECT 
                    IFNULL(f.mes_serv, f.mes_desp) AS mes,
                    IFNULL(f.ano_serv, f.ano_desp) AS ano,
                    IFNULL(f.qtd_serv_periodo, 0) AS qtd_serv_periodo,
                    IFNULL(f.total_periodo, 0) AS bruto_periodo,
                    IFNULL(f.qtd_desp_periodo, 0) AS qtd_desp_periodo,
                    IFNULL(f.desp_periodo, 0) AS desp_periodo,
                    IFNULL(f.total_periodo, 0) - IFNULL(f.desp_periodo, 0) AS liquido_periodo
                FROM full_cte f
                ORDER BY ano ASC, mes ASC
            )
        SELECT 
            ', @inicio_periodo ,' AS inicio_periodo,
            ', @fim_periodo ,' AS fim_periodo,
            grp_cte.qtd_serv_periodo,
            grp_cte.bruto_periodo,
            grp_cte.qtd_desp_periodo,
            grp_cte.desp_periodo,
            grp_cte.liquido_periodo,
            SUM(qtd_serv_periodo) OVER() AS qtd_serv_total,
            SUM(qtd_desp_periodo) OVER() AS qtd_desp_total,
            AVG(bruto_periodo) OVER() AS media_bruto_periodo,
            SUM(bruto_periodo) OVER() AS bruto_total,
            AVG(desp_periodo) OVER() AS media_desp_periodo,
            SUM(desp_periodo) OVER() AS desp_total,
            AVG(liquido_periodo) OVER() AS media_liquido_periodo,
            SUM(liquido_periodo) OVER() AS liquido_total
        FROM grp_cte');

    PREPARE report_fin FROM @stmt;
    
    EXECUTE report_fin 
        USING 
        @dt_hr_inicio, @dt_hr_fim, 
        @dt_hr_inicio, @dt_hr_fim;
    
    DEALLOCATE PREPARE report_fin;
END;$$
DELIMITER ;
    