/*
REALIZA PROCESSOS NA TABELA "servico_realizado" com base nos parâmetros

Formato para "objServ" para "acao" "insert":
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

Formato para "objServ" para "acao" "update":
    {
        "id": 1, <-- id do serviço realizado
        "servico": 1, <-- Id do serviço oferecido pela empresa
        "funcionario": 1, <-- Id do funcionário que realizou
        "info": 1, <- PK de "info_servico" que deverá ser atribuída ao registro de "servico_realizado". Deverá ser incluída caso desejar alterar as tabelas relacionadas ao info_servico especificado. Se não for incluído, um novo info_servico será gerado e a chave estrangeira será atualizada para referir ao novo registro de info_servico
        "inicio": "2025-04-01T08:34:23.388", <-- Data e hora de início da realização do serviço
        "fim": "2025-04-01T10:12:23.388", <-- Data e hora de finalização do serviço
        "observacoes": "", <-- Observações opcionais do registro (deixar null, se deverá ser removida)
        "pets" : [
            {
                "id": 1, <- id do pet
                "alimentacao": "", <- Instruções opcionais de alimentação (deixar null, se não deverá ser removida)
                "remedios": [{"id": 1, "nome": "", "instrucoes": ""}, {"id": 1, "nome": "", "instrucoes": ""}]  <-- deixar núlo se não aplicável
            }
        ],
        "enderecos": [{"id": 1, "tipo": "devolver", "logradouro": "", "numero": "", "bairro": "", "cidade": "", "estado": ""}] <-- deixar núlo se deverá remover
    }
    }
*/

DELIMITER $$
CREATE PROCEDURE servico_realizado
    (
        IN acao ENUM("insert", "update"),
        IN objServ JSON
    )
    COMMENT 'Insere ou modifica o registro de um servico realizado e suas tabelas relacionadas'
    NOT DETERMINISTIC
    MODIFIES SQL DATA
    BEGIN
        -- Infos de serviço
        DECLARE id_serv_real INT; /* PK em "servico_realizado" */
        DECLARE id_info_serv INT; /* PK da tabela info_servico*/
        DECLARE dt_hr_ini, dt_hr_fin DATETIME;
        DECLARE objInfo JSON;

        -- Condições
        DECLARE err_not_object CONDITION FOR SQLSTATE '45000';
        DECLARE err_no_for_id_update CONDITION FOR SQLSTATE '45002';

        -- Validação geral
        IF JSON_TYPE(objServ) <> "OBJECT" THEN
            SIGNAL err_not_object SET MESSAGE_TEXT = 'Argumento não é um objeto JSON';
        END IF;

        SET dt_hr_ini = CAST( JSON_UNQUOTE(JSON_EXTRACT(objServ, '$.inicio')) AS DATETIME );
        SET dt_hr_fin = CAST( JSON_UNQUOTE(JSON_EXTRACT(objServ, '$.fim')) AS DATETIME );

        -- Processos para inserção de servico_realizado
        IF acao = "insert" THEN
            SET objInfo = JSON_REMOVE(objServ, '$.id', '$.info'); /* Remove para não gerar problemas, pois id aqui é o do servico_realizado, mas no procedimento info_servico() é o do info_servico */
            CALL info_servico('insert', objInfo);
            SET id_info_serv = get_last_insert_info_servico(); /* Recebe o último id de info_servico cadastrado */

            -- Inserção do serviço realizado
            INSERT INTO servico_realizado (id_info_servico, dt_hr_inicio, dt_hr_fim) VALUE (id_info_serv, dt_hr_ini, dt_hr_fin);

        ELSEIF acao = "update" THEN
            SET id_serv_real = JSON_EXTRACT(objServ, '$.id');
            SET id_info_serv = JSON_EXTRACT(objServ, '$.info'); /* Id do info_servico, que, se for informado, será usado para atualizar informações relacionadas na tabela info_servico*/

            SET objInfo = JSON_REMOVE(objServ, '$.info');

            IF ISNULL(id_serv_real) THEN
                SIGNAL err_no_for_id_update SET MESSAGE_TEXT = "Nao foi informado id de servico_realizado para acao update";
            END IF;

            IF ISNULL(id_info_servico) THEN /* Se um novo info_servico deverá ser cadastrado */
                SET objInfo = JSON_REMOVE(objInfo, '$.id'); /* Remove id de servico_realizado para evitar problemas futuros */
                CALL info_servico('insert', objInfo);
                SET id_info_serv = get_last_insert_info_servico(); /* Atualiza o id que deverá constar no registro em servico_realizado */

            ELSE /* Se o registro do info_servico de servico_realizado deverá ser atualizado */
                SET objInfo = JSON_REPLACE(objInfo, '$.id', id_info_serv); /* Altera a referência para se referir ao id do info_servico a ser modificado */
                CALL info_servico('update', objInfo);
            END IF;

            -- Altera registro do servico_realizado
            UPDATE servico_realizado SET id_info_servico = id_info_serv, dt_hr_inicio = dt_hr_ini, dt_hr_fim = dt_hr_fin WHERE id = id_serv_real;

        END IF;
    END;$$
DELIMITER ;
