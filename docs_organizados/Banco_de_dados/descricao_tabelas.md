 
# descrição de tabelas do schema tal

## tabela t
Descrição da tabela
#### Informações adicionais:
- forma de validação: feitas nos triggers
- validações
    + coluna 1:
        + nome vazio: sim
        + numero < 0: em progresso
        + data no futuro: não implementado
- método de inserção preferido: procedures
- triggers:
    + insert: nomedotrigger
    + update: nomedotrigger
    + delete: nomedotrigger
- procedures de CRUD: 
    + proc1
    + proc2
- procedures que inserem de forma secundária: 
    + proc1 
    + proc2
    + proc3