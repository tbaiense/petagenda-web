DELIMITER $$
CREATE PROCEDURE create_schema_empresa (
    IN nome_bd VARCHAR(32)
    )
    COMMENT 'Cria um novo esquema para empresa'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        DECLARE schema_script MEDIUMTEXT;

        -- SCRIPT DE CRIACAO ===============================================================================================================================================




        -- PREPARANDO STATEMENT ============================================================================================================================================
        PREPARE schema_stmt FROM @schema_create_stmt;

        DEALLOCATE PREPARE schema_stmt;
    END;$$
DELIMITER ;
