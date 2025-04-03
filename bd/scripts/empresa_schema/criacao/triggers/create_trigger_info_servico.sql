DELIMITER $$
CREATE TRIGGER trg_info_servico_insert
    AFTER INSERT
    ON info_servico
    FOR EACH ROW
    BEGIN
        SET @last_insert_info_servico_id = NEW.id;
    END;$$
DELIMITER ;
