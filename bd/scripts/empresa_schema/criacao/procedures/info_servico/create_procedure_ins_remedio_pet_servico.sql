DELIMITER $$
CREATE PROCEDURE ins_remedio_pet_servico (
    IN id_pet_serv INT,
    IN nome_rem VARCHAR(128),
    IN inst TEXT)
    COMMENT 'Atribui um remédio a um pet participante de um serviço'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        INSERT INTO remedio_pet_servico (id_pet_servico, nome, instrucoes) VALUE
            (id_pet_serv, nome_rem, inst);
    END;$$
DELIMITER ;
