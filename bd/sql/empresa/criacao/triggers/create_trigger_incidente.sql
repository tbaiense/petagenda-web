-- ======== TRIGGERS DA TABELA "incidente" ========

/* TRIGGER DE INSERÇÃO 1
 *  Valida a inserção da data e hora de ocorrência do incidente.
 * */
DELIMITER $$
CREATE TRIGGER trg_incidente_insert
    BEFORE INSERT
    ON incidente
    FOR EACH ROW
    BEGIN
        DECLARE dt_hr_ini_serv DATETIME;
        DECLARE dt_hr_fim_serv DATETIME;

        DECLARE err_dt_hr CONDITION FOR SQLSTATE '45000';

        SELECT dt_hr_inicio, dt_hr_fim
            INTO dt_hr_ini_serv, dt_hr_fim_serv
            FROM servico_realizado
            WHERE id = NEW.id_servico_realizado;

        IF NEW.dt_hr_ocorrido > CURRENT_TIMESTAMP() THEN
            SIGNAL err_dt_hr
                SET MESSAGE_TEXT = "Data de ocorrencia deve ser anterior ao momento atual";
        ELSEIF NEW.dt_hr_ocorrido > dt_hr_fim_serv THEN
            SIGNAL err_dt_hr
                    SET MESSAGE_TEXT = "Data de ocorrencia deve ser anterior a finalizacao do servico realizado";
        ELSEIF NEW.dt_hr_ocorrido < dt_hr_ini_serv THEN
            SIGNAL err_dt_hr
                    SET MESSAGE_TEXT = "Data de ocorrencia deve ser posterior ao inicio do servico realizado";
        END IF;
    END;$$
DELIMITER ;
 
/* TRIGGER DE UPDATE 1
 *  Valida a atualização da data e hora de ocorrência do incidente.
 * */

DELIMITER $$
CREATE TRIGGER trg_incidente_update
    BEFORE UPDATE
    ON incidente
    FOR EACH ROW
    BEGIN
        DECLARE dt_hr_ini_serv DATETIME;
        DECLARE dt_hr_fim_serv DATETIME;

        DECLARE err_dt_hr CONDITION FOR SQLSTATE '45000';

        SELECT dt_hr_inicio, dt_hr_fim
            INTO dt_hr_ini_serv, dt_hr_fim_serv
            FROM servico_realizado
            WHERE id = NEW.id_servico_realizado;

        IF NEW.dt_hr_ocorrido > CURRENT_TIMESTAMP() THEN
            SIGNAL err_dt_hr
                SET MESSAGE_TEXT = "Data de ocorrencia deve ser anterior ao momento atual";
        ELSEIF NEW.dt_hr_ocorrido > dt_hr_fim_serv THEN
            SIGNAL err_dt_hr
                    SET MESSAGE_TEXT = "Data de ocorrencia deve ser anterior a finalizacao do servico realizado";
        ELSEIF NEW.dt_hr_ocorrido < dt_hr_ini_serv THEN
            SIGNAL err_dt_hr
                    SET MESSAGE_TEXT = "Data de ocorrencia deve ser posterior ao inicio do servico realizado";
        END IF;
    END;$$
DELIMITER ;
