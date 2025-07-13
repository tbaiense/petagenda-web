DELIMITER $$
CREATE TRIGGER trg_empresa_update
    BEFORE UPDATE
    ON empresa
    FOR EACH ROW
    BEGIN
        DECLARE c_servico, c_rel_simples, c_rel_detalhado INT;
        IF OLD.nome_bd IS NULL AND NEW.licenca_empresa IS NOT NULL THEN
            SET NEW.nome_bd = CONCAT("emp_", NEW.id);
        END IF;
        
        IF OLD.licenca_empresa IS NULL AND NEW.licenca_empresa IS NOT NULL OR NEW.licenca_empresa <> OLD.licenca_empresa THEN 
            CASE NEW.licenca_empresa
                WHEN "basico" THEN
                    SET c_servico = 75;
                    SET c_rel_simples = 2;
                    SET c_rel_detalhado = OLD.cota_relatorio_detalhado;
                WHEN "profissional" THEN
                    SET c_servico = OLD.cota_servico;
                    SET c_rel_simples = 12;
                    SET c_rel_detalhado = 8;
                WHEN "corporativo" THEN
                    SET c_servico = OLD.cota_servico;
                    SET c_rel_simples = OLD.cota_relatorio_simples;
                    SET c_rel_detalhado = OLD.cota_relatorio_detalhado;
            END CASE;

            SET NEW.cota_servico = c_servico;
            SET NEW.cota_relatorio_simples = c_rel_simples;
            SET NEW.cota_relatorio_detalhado = c_rel_detalhado;
        END IF;
    END;$$
DELIMITER ;
