DELIMITER $$
CREATE PROCEDURE  set_funcionario_info_servico(
    IN id_func INT,
    IN id_info_serv INT)
    COMMENT 'Altera o registro da informação de serviço atualizando o funcionário atribuído'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- TODO: fazer validação de quando o id_info_servico não existe
        UPDATE info_servico SET id_funcionario = id_func WHERE id = id_info_serv LIMIT 1;
    END;$$
DELIMITER ;
