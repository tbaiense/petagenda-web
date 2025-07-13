DELIMITER $$
CREATE PROCEDURE GerarServicos(IN amount INT, IN inicio DATE)
BEGIN
    DECLARE counter INT DEFAULT 0;
    DECLARE data_inicio DATE;
    DECLARE hora_inicio TIME;
    DECLARE inicio_datetime DATETIME;
    DECLARE duracao_minutos INT;
    DECLARE fim_datetime DATETIME;
    DECLARE servico_id INT;
    DECLARE funcionario_id INT;
    DECLARE pet_id INT;
    DECLARE json_data TEXT;

    WHILE counter < amount DO
        -- Gera data aleatória entre 2018 e 2024
        SET data_inicio = DATE_ADD(inicio, INTERVAL FLOOR(RAND() * 2555) DAY);
        
        -- Gera hora inicial entre 08:00 e 20:00
        SET hora_inicio = SEC_TO_TIME(FLOOR(28800 + RAND() * 43200));
        
        -- Combina data e hora
        SET inicio_datetime = TIMESTAMP(data_inicio, hora_inicio);
        
        -- Gera duração entre 15 min e 3 horas
        SET duracao_minutos = 15 + FLOOR(RAND() * 166);
        SET fim_datetime = DATE_ADD(inicio_datetime, INTERVAL duracao_minutos MINUTE);
        
        -- Seleciona IDs aleatórios
        SET servico_id = 1 + FLOOR(RAND() * 6);
        SET funcionario_id = 1 + FLOOR(RAND() * 4);
        SET pet_id = 1 + FLOOR(RAND() * 78);
        
        -- Constrói o JSON
        SET json_data = CONCAT(
            '{"inicio": "', DATE_FORMAT(inicio_datetime, '%Y-%m-%d %H:%i'),
            '", "fim": "', DATE_FORMAT(fim_datetime, '%Y-%m-%d %H:%i'),
            '", "info": {"servico": ', servico_id,
            ', "funcionario": ', funcionario_id,
            ', "pets": [{"id": ', pet_id, '}]}}'
        );
        
        -- Chama o procedimento
        CALL servico_realizado('insert', json_data);
        SET counter = counter + 1;
    END WHILE;
END$$
DELIMITER ; 
