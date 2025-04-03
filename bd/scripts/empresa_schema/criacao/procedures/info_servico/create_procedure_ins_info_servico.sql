DELIMITER $$
CREATE PROCEDURE ins_info_servico(
    IN id_serv_oferecido INT,
    IN id_func INT,
    IN obs VARCHAR(250))
    BEGIN
        INSERT INTO info_servico (id_servico_oferecido, id_funcionario, observacoes) VALUE
            (id_serv_oferecido, id_func, obs);
    END;$$
DELIMITER ;
