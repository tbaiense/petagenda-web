DELIMITER $$
CREATE PROCEDURE ins_pet_servico (
    IN id_p INT,
    IN id_info_serv INT,
    IN instrucao_alim TEXT)
    COMMENT 'Insere um registros de pet a uma informação de serviço'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        INSERT INTO pet_servico (id_pet, id_info_servico, instrucao_alimentacao) VALUE
            (id_p, id_info_serv, instrucao_alim);
    END;$$
DELIMITER ;
