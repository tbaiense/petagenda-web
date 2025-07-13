-- ======== TRIGGERS DA TABELA "pacote_agend" ========

/* TRIGGER DE UPDATE 1
 * Gerencia os agendamentos relacionados ao pacote com base no estado do pacote.
 * */

DELIMITER $$
CREATE TRIGGER trg_pacote_agend_update
    BEFORE UPDATE
    ON pacote_agend
    FOR EACH ROW
    BEGIN
        DECLARE pets_found INT;
        DECLARE dias_found INT;
        DECLARE cur_done INT DEFAULT FALSE; /* variável de controle do loop dos cursores */
        DECLARE id_pac INT DEFAULT OLD.id;
        DECLARE qtd_count INT DEFAULT 0; /* Controla quantas recorrências da frequêncai foram cadastradas */
        DECLARE offset_count INT DEFAULT 0;
        -- Infos para agendamento
        DECLARE id_agend INT;
        DECLARE dt_hr_marc DATETIME; /* Guarda o dia que foi calculado para ser inserido no agendamento, e adicionado do horário do pacote */
        DECLARE dt_agend DATETIME;
        DECLARE dia_pac INT;
        DECLARE dt_base DATETIME;
        DECLARE objAgend JSON;
            /*Formato para "objAgend":
                {
                    "dtHrMarcada": <DATETIME>,
                    "info": {
                        "servico": <INT>, <-- PK da tabela servico_oferecido (id_servico_oferecido em "info_servico")
                        "pets" : [
                            +{
                                "id": <INT> <-- PK da tabela pet (id_pet em "pet_servico")
                            }
                        ]
                    }
                }
            */

        -- Info pets
        DECLARE id_pet_cli INT;

        DECLARE err_missing_info CONDITION FOR SQLSTATE '45000';

        -- Cursores
        DECLARE cur_pets CURSOR FOR SELECT id_pet FROM pet_pacote WHERE id_pacote_agend = id_pac;
        DECLARE cur_dias CURSOR FOR SELECT dia FROM dia_pacote WHERE id_pacote_agend = id_pac;

        -- Handlers para cursores
        DECLARE CONTINUE HANDLER
            FOR NOT FOUND
            SET cur_done = TRUE;

        IF NEW.estado = "preparado" AND OLD.estado = "criado" THEN
            SET NEW.estado = "criado"; /* Mantém o estado antigo para caso houver erro durante a criação dos agendamentos */

            -- Verificar se possui dias agendados e pets participantes
            SELECT id INTO dias_found FROM dia_pacote WHERE id_pacote_agend = id_pac LIMIT 1;
            SELECT id INTO pets_found FROM pet_pacote WHERE id_pacote_agend = id_pac LIMIT 1;


            IF (pets_found IS NULL OR dias_found IS NULL) THEN
                SIGNAL err_missing_info
                    SET MESSAGE_TEXT = "Faltam informacoes necessarias no pacote de agendamento";
            END IF;

            -- Criar JSON modelo para agendamentos
            SET objAgend = JSON_OBJECT();
            SET objAgend = JSON_INSERT(objAgend, '$.info', JSON_OBJECT());
            SET objAgend = JSON_INSERT(objAgend, '$.info.servico', OLD.id_servico_oferecido);
            SET objAgend = JSON_INSERT(objAgend, '$.info.pets', JSON_ARRAY());
            
            -- Preenchendo array de pets
            OPEN cur_pets;
            pets_loop: LOOP
                FETCH cur_pets INTO id_pet_cli;

                IF cur_done = TRUE THEN
                    LEAVE pets_loop;
                END IF;

                -- Inserindo pets no JSON
                SET objAgend = JSON_ARRAY_INSERT(objAgend, '$.info.pets[0]', JSON_OBJECT());
                SET objAgend = JSON_INSERT(objAgend, '$.info.pets[0].id', id_pet_cli);

            END LOOP;
            CLOSE cur_pets;


            -- Definindo a data base para os cálculos
            SET dt_base = DATE_ADD(OLD.dt_inicio, INTERVAL OLD.hr_agendada HOUR_SECOND);
            CASE OLD.frequencia
                WHEN "dias_semana" THEN
                    SET dt_base = DATE_ADD(dt_base, INTERVAL -(DAYOFWEEK(OLD.dt_inicio) -1) DAY); /* Encontra o primeiro dia da semana (domingo = 1) de "dt_inicio" */

                WHEN "dias_mes" THEN
                    SET dt_base = DATE_ADD(dt_base, INTERVAL -(DAYOFMONTH(OLD.dt_inicio) -1) DAY); /* Encontra o primeiro dia do mês (= 1) de "dt_inicio" */

                WHEN "dias_ano" THEN
                    SET dt_base = DATE_ADD(dt_base, INTERVAL -(DAYOFYEAR(OLD.dt_inicio) -1) DAY); /* Encontra o primeiro dia do ano (= 1) de "dt_inicio" */
            END CASE;

            -- Loop de criação de agendamentos
            SET cur_done = FALSE;
            OPEN cur_dias;
            dias_loop: LOOP

                FETCH cur_dias INTO dia_pac;

                IF cur_done = TRUE THEN
                    LEAVE dias_loop;
                END IF;

                SET dt_agend = DATE_ADD(dt_base, INTERVAL (dia_pac - 1) DAY);
                -- Loop de repetição do dia especificado, de acordo com "qtd_recorrencia"
                SET qtd_count = 0;
                SET offset_count = 0;
                WHILE qtd_count < OLD.qtd_recorrencia DO

                    CASE OLD.frequencia
                        WHEN "dias_semana" THEN
                            SET dt_hr_marc = DATE_ADD(dt_agend, INTERVAL offset_count WEEK);
                        WHEN "dias_mes" THEN
                            SET dt_hr_marc = DATE_ADD(dt_agend, INTERVAL offset_count MONTH);
                        WHEN "dias_ano" THEN
                            SET dt_hr_marc = DATE_ADD(dt_agend, INTERVAL offset_count YEAR);
                    END CASE;

                    -- se dt_agend é igual ou superior a dt_inicio e ao momento atual
                    IF dt_hr_marc >= OLD.dt_inicio AND dt_hr_marc > CURRENT_TIMESTAMP() THEN
                        -- Criação do agendamento
                        SET objAgend = JSON_SET(objAgend, '$.dtHrMarcada', dt_hr_marc);
                        CALL agendamento('insert', objAgend);
                        SET id_agend = LAST_INSERT_ID();
                        -- Atribuição da FK de pacote_agend
                        UPDATE agendamento SET id_pacote_agend = id_pac WHERE id = id_agend;

                        SET qtd_count = qtd_count + 1;
                    END IF;

                    SET offset_count = offset_count + 1;
                END WHILE;
            END LOOP;
            CLOSE cur_dias;
            SET NEW.estado = "ativo"; /* Atualiza o estado final */
        END IF;
    END;$$
DELIMITER ;

