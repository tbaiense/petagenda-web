-- ======== TRIGGERS DA TABELA "info_servico" ========

DELIMITER $$
CREATE TRIGGER trg_info_servico_insert_before
    BEFORE INSERT
    ON info_servico
    FOR EACH ROW
    BEGIN
        DECLARE err_cotas_insuficiente CONDITION FOR SQLSTATE '45001';

        IF dbo.validar_cotas("servico") = FALSE THEN
            SIGNAL err_cotas_insuficiente SET MESSAGE_TEXT = "Cotas insuficientes para cadastro de servico realizado";
        END IF;

        SET @last_insert_info_servico_id = NEW.id;
    END;$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_info_servico_insert
    AFTER INSERT
    ON info_servico
    FOR EACH ROW
    BEGIN
        SET @last_insert_info_servico_id = NEW.id;
    END;$$
DELIMITER ;

/* TRIGGER DE UPDATE 1
 *
 *  + OBJETIVOS:
 *      - Atribuir o estado "preparado" para agendamentos, caso funcionário tenha sido atribuído na tabela "info_servico"
 * */
DELIMITER $$
CREATE TRIGGER trg_info_servico_update
    AFTER UPDATE
    ON info_servico
    FOR EACH ROW
    BEGIN
        IF OLD.id_funcionario IS NULL AND NEW.id_funcionario IS NOT NULL THEN
                UPDATE agendamento
                    SET estado = "preparado"
                    WHERE
                        id_info_servico = NEW.id
                        AND estado = "criado" LIMIT 1;
        END IF;

    END;$$
DELIMITER ;
