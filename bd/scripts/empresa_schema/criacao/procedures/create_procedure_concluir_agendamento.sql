/*
PROCEDIMENTO PARA CONCLUSÃO DE AGENDAMENTOS.
Deverá ser chamado ao invés de "set_estado_agendamento" por permitir modificar as informações.
*/

DELIMITER $$
CREATE PROCEDURE concluir_agendamento(
    IN id_agend INT,
    IN objServReal JSON /* Um JSON de serviço realizado ou NULL. Um objeto que deverá ser informado caso o novo registro de serviço realizado deva possuir informações diferentes das que foram agendadas. */
    )
    COMMENT 'Altera estado de agendamento para concluido e cria novos info_servico e associa ao servico_realizado gerado, se for necessário'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN

        DECLARE novo_id_info_serv INT; /* PK do novo info_servico, se aplicável */
        DECLARE id_info_serv INT;
        DECLARE dt_ini DATETIME;
        DECLARE dt_fin DATETIME;

    END;$$
DELIMITER ;
