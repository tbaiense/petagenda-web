/*
PROCEDIMENTO DE ATUALIZAÇÃO DO ESTADO DE AGENDAMENTOS
*/
DELIMITER $$
CREATE PROCEDURE set_estado_agendamento(
    IN est ENUM("criado", "preparado", "pendente", "concluido", "cancelado"),
    IN id_agend INT
    )
    COMMENT 'Define um novo estado para o agendamento'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        UPDATE agendamento SET estado = est WHERE id = id_agend;
    END;$$
DELIMITER ;
