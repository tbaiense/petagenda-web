# Esboço do que pode ser compreendido pelos requisitos
A seguir, um resumo separado em tópicos da estrutura da aplicação.

## Informações armazenadas
- Funcionários
    - Nome
    - Endereço
    - CPF
    - Função exercida
    - Telefone de contato

- Cliente
    - Nome
    - CPF
    - Endereço
    - Telefone
    - Serviços contratados (talvez pacotes de agendamento ativos)
    - Estado de atividade (ativo ou inativo)

- Pets
    - Nome
    - Raça
    - Sexo
    - Porte
    - Cor
    - É castrado?
    - Cartão de vacinação
    - Estado de saúde
    - Dono
    - Com quem deve ser buscado
    - Com quem deve ser devolvido
    - Foto do pet (talvez para ajudar na identificação?)

- Contas de usuário
    - Nome
    - Endereço
    - CPF
    - Telefone
    - Senha
    - Serviço que presta
    - Pergunta de segurança
    - Resposta da pergunta de segurança
    - Permissão da conta

- Agendamentos
    - Data marcada
    - Hora marcada
    - Endereço do pet
    - Quantidade de passeios (seria para agendamentos recorrentes?)
        > Obs.: se for utilizado para criação de agendamentos recorrentes ( se repetem em tal dia de toda semana, ou tantas vezes por mês, etc...), acredito que seja melhor sinalizar isso de outra forma, talvez criando uma tabela de agendamentos recorrentes para identificá-los como um conjunto de agendamentos pertencentes a um "pacote de agendamentos" e identificá-los com uma mesma chave estrangeira que represente o "pacote" a qual ele pertence.

    - Observações
    - Local do cuidado (se for serviço de consulta médica, onde o pet deverá ser levado, por exemplo)
    - Serviço agendado
    - Pet participante
    - Funcionário atribuído
    - Alimentação do pet
        - Horário
        - Instruções (quantidade, etc)
    - Remédios a administrar
        - Nome
        - Horário
        - Instruções

- Serviços
    - Nome
    - Duração aproximada
    - Preço
    - Descrição
    - Categoria do serviço (passeio, cuidado, ...)

- Serviços realizados (talvez serviços agendados)
    - O(s) pet(s) foi entregue?
    - Data iniciado
    - Hora iniciado
    - Data finalizado
    - Hora finalizado
    - Observações
    - Incidentes
        - Data
        - Horário
        - Representa emergência?
        - Descrição
        - Pet envolvido

- Relatórios
    - Pets
        - Quais os serviços em que participou
        - Quantidade de serviços que particiou
        - Incidentes em que esteve envolvido
    - Funcionários
        - Quantidade de serviços prestados
        - Tempo médio gasto em cada serviço
        - Disponibilidade (horários agendados)
        - Serviços que executou
