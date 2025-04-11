-- ======== TRIGGERS DA TABELA "servico_realizado" ========

/* TRIGGER DE INSERÇÃO 1
 *  Controla definição de valores cobrados caso não sejam informados durante a inserção do registro.
 *  + OBJETIVOS:
        - Verificar cotas antes de cadastrar
 *      - Inserir "valor_servico" nos registros em que o tipo da cobrança (coluna "tipo_preco" em "servico_oferecido") do serviço que foi realizado for "servico"
 *      - Inserir "valor_total" nos registros automaticamente caso "valor_servico" e "valor_total" seja inseridos como NULL
 * */
DELIMITER $$
CREATE TRIGGER trg_servico_realizado_insert /* Fazer procedimento que atualiza preços */
    BEFORE INSERT
    ON servico_realizado
    FOR EACH ROW
    BEGIN
        -- Verificação dos valores a serem inseridos
        IF ISNULL(NEW.valor_servico) AND ISNULL(NEW.valor_total) THEN
            -- Buscando valor e forma de cobrança da tabela "servico_oferecido" e atualizando automaticamente
            CALL get_valores_info_servico(NEW.id_info_servico, NEW.valor_servico, NEW.valor_total);
        END IF;
    END;$$
DELIMITER ;

