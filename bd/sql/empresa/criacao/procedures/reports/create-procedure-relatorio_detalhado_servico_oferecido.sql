DELIMITER $
CREATE PROCEDURE relatorio_detalhado_servico_oferecido (
    IN inicio DATETIME,
    IN fim DATETIME
)
BEGIN
    DECLARE err_cotas_insuficiente CONDITION FOR SQLSTATE '45001';

    IF dbo.validar_cotas("relatorio-detalhado") = FALSE THEN
        SIGNAL err_cotas_insuficiente SET MESSAGE_TEXT = "Cotas insuficientes para geração de relatório detalhado";
    END IF;
    
    SET SESSION sql_mode = 'TRADITIONAL';

    SET @inicio = inicio;
    SET @fim = fim;

    WITH 
        s_cte AS (
            SELECT 
                id_servico_oferecido,
                COUNT(id_servico_oferecido) qtd_serv_periodo,
                AVG(valor_total) media_valor,
                SUM(valor_total) soma_valor
            FROM vw_servico_realizado
            WHERE 
                dt_hr_fim BETWEEN @inicio AND @fim
            GROUP BY 
                id_servico_oferecido
        )
    SELECT 
        s.id_servico_oferecido,
        s.nome,
        s.id_categoria,
        s.nome_categoria,
        s.preco,
        @inicio AS inicio_periodo,
        @fim AS fim_periodo,
        IFNULL(s_c.qtd_serv_periodo, 0) AS qtd_serv_periodo,
        IFNULL(s_c.media_valor, 0) AS media_valor,
        IFNULL(s_c.soma_valor, 0) AS soma_valor
    FROM vw_servico_oferecido s 
        LEFT JOIN s_cte s_c ON (s_c.id_servico_oferecido = s.id_servico_oferecido)
    ORDER BY soma_valor DESC, media_valor DESC, nome ASC, nome_categoria ASC, preco DESC;

END;$$
DELIMITER ;