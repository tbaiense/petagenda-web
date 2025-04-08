/*
PROCEDIMENTO DE ATUALIZAÇÃO DO ESTADO DE PACOTES DE AGENDAMENTO
*/
DELIMITER $$
CREATE PROCEDURE set_estado_pacote_agend(
    IN est ENUM("criado", "preparado", "ativo", "concluido", "cancelado"),
    IN id_pac INT
    )
    COMMENT 'Define um novo estado para o pacote de agendamento'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        UPDATE pacote_agend SET estado = est WHERE id = id_pac;
    END;$$
DELIMITER ;
