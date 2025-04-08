DELIMITER $$
CREATE PROCEDURE set_empresa_usuario (
    IN id_emp INT,
    IN id_u INT
    )
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        UPDATE usuario SET id_empresa = id_emp WHERE id = id_u;
    END;$$
DELIMITER ;
