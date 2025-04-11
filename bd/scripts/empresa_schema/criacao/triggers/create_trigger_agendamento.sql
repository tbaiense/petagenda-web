-- ======== TRIGGERS DA TABELA "agendamento" ========

/* TRIGGER DE INSERÇÃO 1
 *  Controla definição de valores cobrados caso não sejam informados durante a inserção do registro.
 *  + OBJETIVOS:
 *      - Atribuir o estado "preparado", caso funcionário tenha sido atribuído na tabela "info_servico" 
 *      - Inserir "valor_servico" nos registros em que o tipo da cobrança (coluna "tipo_preco" em "agendamento") do serviço que foi realizado for "servico"
 *      - Inserir "valor_total" nos registros automaticamente caso "valor_servico" e "valor_total" seja inseridos como NULL
 * */
DELIMITER $$
CREATE TRIGGER trg_agendamento_insert
    BEFORE INSERT
    ON agendamento
    FOR EACH ROW
    BEGIN
        -- Variáveis usadas na definição do estado inicial
        DECLARE id_func INT;

        -- Verificação de funcionário atribuído e atribuição de estado inicial
        SELECT id_funcionario INTO id_func FROM info_servico WHERE id = NEW.id_info_servico;
        
        IF (id_func IS NOT NULL) THEN /* Se funcionário está atribuído */
            SET NEW.estado = "preparado";
        ELSE
            SET NEW.estado = "criado";
        END IF;
    
        -- Verificação dos valores a serem inseridos
        IF ISNULL(NEW.valor_servico) AND ISNULL(NEW.valor_total) THEN
            -- Buscando valor e forma de cobrança da tabela "agendamento" e atualizando automaticamente
            CALL get_valores_info_servico(NEW.id_info_servico, NEW.valor_servico, NEW.valor_total);
        END IF;
    END;$$
DELIMITER ;
 
/* TRIGGER DE UPDATE 1
 *  Monitora a alteração do estado do agendamento para concluído e cria registro de "servico_realizado" automaticamente
 *  + OBJETIVOS:
 *
 * */

DELIMITER $$
CREATE TRIGGER trg_agendamento_update
    BEFORE UPDATE
    ON agendamento
    FOR EACH ROW
    BEGIN
        DECLARE dt_hr_ini DATETIME DEFAULT NEW.dt_hr_marcada;
        DECLARE dt_hr_fin DATETIME DEFAULT CURRENT_TIMESTAMP();

        IF NEW.estado = "concluido" AND NEW.id_servico_realizado IS NULL AND OLD.estado IN ("preparado", "pendente") THEN
            IF dt_hr_ini > dt_hr_fin OR DATEDIFF(dt_hr_fin, dt_hr_ini) <> 0 THEN
                SET dt_hr_ini = NULL;
            END IF;

            INSERT INTO servico_realizado (id_info_servico, dt_hr_inicio, dt_hr_fim) VALUE
                (NEW.id_info_servico, dt_hr_ini, CURRENT_TIMESTAMP());

            SET NEW.id_servico_realizado = LAST_INSERT_ID();
        END IF;
    END;$$
DELIMITER ;
