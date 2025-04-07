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
        IF NEW.estado = "preparado" AND OLD.estado = "criado" THEN
            SET NEW.estado = "criado"; /* Mantém o estado antigo para caso houver erro durante a criação dos agendamentos */
            -- Verificar se possui dias agendados e pets participantes

            -- Criar JSON modelo para agendamentos

            -- Loop de criação de agendamentos
                -- Criação do agendamento

                -- Atribuição da FK de pacote_agend

            SET NEW.estado = "ativo"; /* Atualiza o estado final */
        END IF;
    END;$$
DELIMITER ;

