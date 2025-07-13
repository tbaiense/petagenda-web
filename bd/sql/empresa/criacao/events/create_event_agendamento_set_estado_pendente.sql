DELIMITER $$
CREATE EVENT agendamento_set_estado_pendente
    ON SCHEDULE EVERY 1 MINUTE
    ON COMPLETION PRESERVE
    COMMENT 'Verifica agendamentos que passaram da data agendada e com estado "preparado" e altera para "pendente"'
    DO BEGIN
        UPDATE agendamento
            SET estado = "pendente"
            WHERE
                dt_hr_marcada < CURRENT_TIMESTAMP()
                AND estado = "preparado";
    END;$$
DELIMITER ;
