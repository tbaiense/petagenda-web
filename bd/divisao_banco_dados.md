# Divisão dos schemas
O PetAgenda utilizará um _schema_ para gerenciamento da aplicação, chamado "dbo", e vários _schemas_ individuais para cada empresa cadastrada.

# O _schema_ "dbo"
Este _schema_ irá conter:
- A tabela com as informações das empresas cadastradas
- A tabela com os endereços das empresas cadastradas
- A tabela com os usuários cadastrados no PetAgenda
- Os eventos utilizados pelo SGDB
- Os triggers utilizados pelo SGBD
- Os stored programs utilizados pelo SGBD
- 
# O _schema_ "empresa"
Este _schema_ irá conter:
- dados da empresa em questão
- serviços oferecidos
- registros de agendamentos e serviços executados
- os triggers de validação dos dados e automatização