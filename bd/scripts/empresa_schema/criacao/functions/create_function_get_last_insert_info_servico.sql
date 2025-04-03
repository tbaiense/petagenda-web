/* Retorna o último id de info_serviço que foi cadastrado, para uso em procedimentos */

SET GLOBAL log_bin_trust_function_creators = 1;

DELIMITER $$
CREATE FUNCTION get_last_insert_info_servico ()
    RETURNS INT
    COMMENT 'Retorna o último registro cadastrado em info_servico'
    NOT DETERMINISTIC
    CONTAINS SQL
    BEGIN
        RETURN @last_insert_info_servico_id;
    END;$$
DELIMITER ;
