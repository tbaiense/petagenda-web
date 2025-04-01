DELIMITER $$
CREATE PROCEDURE ins_servico_realizado (IN servicoObj JSON)
    /* Formato para objeto JSON:
        {
            "servico": 1, <-- Id do serviço oferecido pela empresa
            "funcionario": 1, <-- Id do funcionário que realizou
            "inicio": "2025-04-01T08:34:23.388", <-- Data e hora de início da realização do serviço
            "fim": "2025-04-01T10:12:23.388", <-- Data e hora de finalização do serviço
            "observacoes": "", <-- Observações opcionais do registro (deixar null, se não aplicável)
            "pets" : [
                {
                    "id": 1, <- id do pet
                    "alimentacao": "", <- Instruções opcionais de alimentação (deixar null, se não aplicável)
                    "remedios": [{"nome": "", "instrucoes": ""}, {"nome": "", "instrucoes": ""}]  <-- deixar núlo se não aplicável
                }
            ],
            "enderecos": [{"tipo": "devolver", "logradouro": "", "numero": "", "bairro": "", "cidade": "", "estado": ""}] <-- deixar núlo se não aplicável
        }
    */
    COMMENT 'Cadastra um serviço realizado, criando as informações secundárias necessárias (info_servico, pet_servico, etc)'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN

    END;$$
DELIMITER ;
