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
    - Tipos de serviços contratados
    - Estado de atividade (ativo ou inativo)

- Pets
    - Nome
    - Raça
    - Sexo
    - Porte
    - Cor
    - É castrado
    - Cartão de vacinação
    - Estado de saúde
    - Dono
    - Com quem deve ser buscado
    - Com quem deve ser devolvido

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
    - Quantidade de passeios
    - Observações
    - Local do cuidado
    - Serviço agendado
    - Pet participante
    - Funcionário atribuído
    - Alimentação do pet
        - Horário
    - Remédios a administrar
        - Nome
        - Horário
        - Instruções

- Serviços
    - Nome
    - Duração
    - Preço
    - Descrição

- Serviços realizados (talvez serviços agendados)
    -
    - O pet foi entregue?
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
