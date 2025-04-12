DELIMITER $$
CREATE PROCEDURE login ( IN email_usr VARCHAR(128), IN senha_usr VARCHAR(32) )
    COMMENT 'Realiza verificação se usuário e senha existem em algum usuário cadastrado'
    NOT DETERMINISTIC
    READS SQL DATA
    BEGIN
        DECLARE id_usr_found INT;
        DECLARE id_empresa_found INT;
        DECLARE is_admin CHAR(1);

        DECLARE err_missing_params CONDITION FOR SQLSTATE '45000';

        IF email_usr IS NOT NULL AND senha_usr IS NOT NULL THEN
            SELECT id, id_empresa, e_admin INTO id_usr_found, id_empresa_found, is_admin FROM usuario WHERE email = email_usr AND senha = senha_usr;
            IF id_usr_found IS NOT NULL THEN
                SELECT "SUCCESSFUL", id_empresa_found  AS id_empresa, is_admin AS e_admin;
            ELSE
                SELECT "FAILED", NULL AS id_empresa, NULL AS e_admin;
            END IF;
        ELSE
            SIGNAL err_missing_params SET MESSAGE_TEXT = "Email e senha devem ser informados para login";
        END IF;
    END;$$
DELIMITER ;
