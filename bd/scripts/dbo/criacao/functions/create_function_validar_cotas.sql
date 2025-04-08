DELIMITER $$
CREATE FUNCTION validar_cotas (
    tipo_cota ENUM("servico", "relatorio-simples", "relatorio-detalhado")
    )
    RETURNS INT
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        DECLARE id_emp INT DEFAULT @empresa_atual;
        DECLARE cotas_atual INT;
        DECLARE cotas_apos INT;
        DECLARE licenca_atual ENUM("basico", "profissional", "corporativo");

        DECLARE err_empresa_undefined CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_license CONDITION FOR SQLSTATE '45001';

        IF id_emp IS NULL THEN
            SIGNAL err_empresa_undefined
                SET MESSAGE_TEXT = "A empresa atual nao foi definida para contabilizacao de cotas";
        END IF;

        -- Obtendo licença atual da empresa
        SELECT licenca_empresa INTO licenca_atual FROM empresa WHERE id = id_emp;

        IF licenca_atual IS NULL THEN
            SIGNAL err_no_license
                SET MESSAGE_TEXT = "A empresa nao possui uma licenca ativa para realizar esta acao";
        END IF;

        IF licenca_atual = "corporativo" THEN
            RETURN TRUE;
        ELSEIF licenca_atual IN ("basico", "profissional") THEN
            IF tipo_cota =  "servico" THEN
                IF licenca_atual = "basico" THEN
                    SELECT cota_servico INTO cotas_atual FROM empresa WHERE id = id_emp;
                    -- Verificar quantidade de cotas
                    IF cotas_atual > 0 THEN
                        UPDATE empresa
                            SET cota_servico = cotas_atual - 1
                            WHERE id = id_emp;

                        RETURN TRUE;
                    ELSE
                        RETURN FALSE;
                    END IF;

                ELSE
                    RETURN TRUE;
                END IF;
            ELSEIF tipo_cota = "relatorio-simples" THEN
                -- Verificar quantidade de cotas
                SELECT cota_relatorio_simples INTO cotas_atual FROM empresa WHERE id = id_emp;
                IF cotas_atual > 0 THEN
                    UPDATE empresa
                        SET cota_relatorio_simples = cotas_atual - 1
                        WHERE id = id_emp;

                    RETURN TRUE;
                ELSE
                    RETURN FALSE;
                END IF;

            ELSEIF tipo_cota = "relatorio-detalhado" THEN
                -- Verificar licença
                IF licenca_atual = "profissional" THEN
                    -- Verificar quantidade de cotas
                    SELECT cota_relatorio_detalhado INTO cotas_atual FROM empresa WHERE id = id_emp;
                    IF cotas_atual > 0 THEN
                        UPDATE empresa
                            SET cota_relatorio_detalhado = cotas_atual - 1
                            WHERE id = id_emp;

                        RETURN TRUE;
                    ELSE /* Sem cotas para gerar relatório detalhado */
                        RETURN FALSE;
                    END IF;
                ELSE /* Plano for "basico" */
                    RETURN FALSE;
                END IF;
            END IF;
        END IF;

        RETURN FALSE;
    END;$$
DELIMITER ;
