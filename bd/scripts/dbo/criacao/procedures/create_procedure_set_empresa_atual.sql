DELIMITER $$
CREATE PROCEDURE set_empresa_atual(IN id_emp INT)
    DETERMINISTIC
    CONTAINS SQL
    BEGIN
        DECLARE emp_found INT;

        SELECT id INTO emp_found FROM empresa WHERE id = id_emp;

        IF emp_found IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Empresa atual definida nao existente!";
        END IF;
        SET @empresa_atual = id_emp;
    END;$$
DELIMITER ;
