-- INSERT
DELIMITER $$
CREATE TRIGGER trg_reserva_funcionario_insert
BEFORE INSERT
ON reserva_funcionario
FOR EACH ROW
BEGIN
	DECLARE err_data_passado CONDITION FOR SQLSTATE '45000';
	DECLARE err_hora_inicio_passado CONDITION FOR SQLSTATE '45000';

	IF (NEW.data < CURRENT_DATE()) THEN
		SIGNAL err_data_passado SET MESSAGE_TEXT = "Data de reserva nao pode estar no passado";
	ELSEIF (NEW.data = CURRENT_DATE() AND (NEW.hora_inicio < CURRENT_TIME())) THEN
		SIGNAL err_hora_inicio_passado SET MESSAGE_TEXT = 'Hora de inicio nao pode ser anterior o igual a hora do dia atual';
	END IF;
END;$$
DELIMITER ;
