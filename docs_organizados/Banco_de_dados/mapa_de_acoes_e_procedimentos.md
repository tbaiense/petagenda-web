 
# MAPA DE AÇÕES E PROCEDIMENTOS
Para a comunicação com o SGBD e a realização das atividades de CRUD, será possível usar procedimentos já existentes para tornar esses processos mais fáceis.

### Convenções utilizadas na descrição de formatos JSON:  
- **?**`<TIPO>` | **?**`{}` | **?**`[]`  
    **Descrição:** Sinaliza que o valor é opcional. O valor da propriedade poderá ser atribuído como `undefined` ou `null`. A propriedade poderá ser omitida caso desejado.
    
- **+**`<TIPO>` | **+**`{}` | **+**`[]`  
    **Descrição:** Sinaliza que o valor deverá ocorrer uma ou mais vezes.
<hr>

## Serviço realizado
Tabela: `servico_realizado`  

### Ações
- Cadastrar => `servico_realizado('insert', <json object>)`
  + Formato esperado para `<json object>`:
    ```
    {
        "inicio": ?<DATETIME>,
        "fim": <DATETIME>,
        "info": {
            "servico": <INT>,
            "funcionario": <INT>,
            "observacoes": ?<VARCHAR(250)>,
            "pets" : [
                +{
                    "id": <INT>,
                    "alimentacao": ?<TEXT>,
                    "remedios": ?[
                        +{"nome": <VARCHAR(128)>, "instrucoes": <TEXT>}
                    ]
                }
            ],
            "enderecos": ?[
                +{
                    "tipo": <ENUM("buscar", "devolver", "buscar-devolver")>, 
                    "logradouro": <VARCHAR(128)>, 
                    "numero": <VARCHAR(16)>, 
                    "bairro": <VARCHAR(64)>, 
                    "cidade": <VARCHAR(64)>, 
                    "estado": ?<CHAR(2)>
                }
            ]
        }
    }
    ```
    
  + Exemplo de uso:
    ```
    CALL servico_realizado('insert', '{
        "inicio": "2025-01-01T10:00:00",
        "fim": "2025-01-01T12:00:00",
        "info": {
            "servico": 1,
            "funcionario": 1,
            "observacoes": "Esta é uma observação legal",
            "pets" : [
                {
                    "id": 1,
                    "alimentacao": "comida 1",
                    "remedios": [
                        {"nome": "remedio 1 pet 1", "instrucoes": "aplicar 1 ao pet 1"}
                    ]
                },
                {
                    "id": 2,
                    "alimentacao": "comida 2"
                },
                {
                    "id": 4,
                    "alimentacao": "comida 3",
                    "remedios": [
                        {"nome": "remedio 1 pet 3", "instrucoes": "aplicar 1 ao pet 4"},
                        {"nome": "remedio 2 pet 3", "instrucoes": "aplicar 2 ao pet 4"}
                    ]
                }
            ],
            "enderecos": [
                {
                    "tipo": "devolver", 
                    "logradouro": "Rua A", 
                    "numero": "1", 
                    "bairro": "Primeiro", 
                    "cidade": "I", 
                    "estado": "ST"
                },
                {
                    "tipo": "buscar", 
                    "logradouro": "RUA B", 
                    "numero": "2", 
                    "bairro": "Segundo", 
                    "cidade": "II", 
                    "estado": "ND"
                }
            ]
        }
    }');
    ```
 
  + Tabelas afetadas:
    - `servico_realizado`
    - `info_servico`
    - `pet_servico`
    - `endereco_info_servico`
    - `remedio_pet_servico`
<hr>

## Agendamento
Tabela: `agendamento`  

### Ações
- Cadastrar => `agendamento('insert', <json object>)`
  + Formato esperado para `<json object>`:
    ```
    {
        "data_hora_marcada": <DATETIME>,
        "info": {
            "servico": <INT>,
            "funcionario": ?<INT>,
            "observacoes": ?<VARCHAR(250)>,
            "pets" : [
                +{
                    "id": <INT>,
                    "alimentacao": ?<TEXT>,
                    "remedios": ?[
                        +{"nome": <VARCHAR(128)>, "instrucoes": <TEXT>}
                    ]
                }
            ],
            "enderecos": ?[
                +{
                    "tipo": <ENUM("buscar", "devolver", "buscar-devolver")>, 
                    "logradouro": <VARCHAR(128)>, 
                    "numero": <VARCHAR(16)>, 
                    "bairro": <VARCHAR(64)>, 
                    "cidade": <VARCHAR(64)>, 
                    "estado": ?<CHAR(2)>
                }
            ]
        }
    }
    ```
    
    + Exemplo de uso:
    ```
    CALL agendamento('insert', '{
        "data_hora_marcada": "2030-01-01T12:00:00",
        "info": {
            "servico": 3,
            "funcionario": 3,
            "observacoes": "Esta é uma observação legal",
            "pets" : [
                {
                    "id": 3,
                    "alimentacao": "comida 1",
                    "remedios": [
                        {"nome": "remedio 1 pet 3", "instrucoes": "aplicar 1 ao pet 3"}
                    ]
                },
                {
                    "id": 6,
                    "alimentacao": "comida 6"
                },
                {
                    "id": 1,
                    "alimentacao": "comida 1",
                    "remedios": [
                        {"nome": "remedio 1 pet 1", "instrucoes": "aplicar 1 ao pet 1"},
                        {"nome": "remedio 2 pet 1", "instrucoes": "aplicar 2 ao pet 1"}
                    ]
                }
            ],
            "enderecos": [
                {
                    "tipo": "devolver", 
                    "logradouro": "Rua A", 
                    "numero": "1", 
                    "bairro": "Primeiro", 
                    "cidade": "I", 
                    "estado": "ST"
                },
                {
                    "tipo": "buscar", 
                    "logradouro": "RUA B", 
                    "numero": "2", 
                    "bairro": "Segundo", 
                    "cidade": "II", 
                    "estado": "ND"
                }
            ]
        }
    });
    ```
    
    + Tabelas afetadas:
        - `agendamento`
        - `info_servico`
        - `pet_servico`
        - `endereco_info_servico`
        - `remedio_pet_servico`
<hr>

## Informação de serviço
Tabela: `info_servico`  

### Ações
- Cadastrar => `ins_info_servico(<id_servico_oferecido>, <id_funcionario>, <observacoes>)`

- Definir funcionário atribuído => `set_funcionario_servico(<id_funcionario>, <id_info_servico>)`

- Inserir endereço => `ins_endereco_info_servico(<id_info_servico>, <tipo>, <logradouro>, <numero>, <bairro>, <cidade>, <estado>)`

<hr>

## Pet participante de serviço
Tabela: `pet_servico`  

### Ações
- Cadastrar => `ins_pet_servico(<id_pet>, <id_info_servico>, <instrucao_alimentacao>)`

- Adicionar remédio => `ins_remedio_pet_servico(<id_pet_servico>, <nome>, <instrucoes>)`
<hr>
    
