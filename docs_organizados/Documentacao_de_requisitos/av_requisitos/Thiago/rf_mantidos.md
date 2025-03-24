# Especificação de Requisitos do Sistema
Versão: 0.3  
Data: 21 de março de 2025
<hr>  

## <center>Requisitos Funcionais</center>

### [RF 01] Cadastro de clientes
A solução permitirá ao operador realizar o cadastro dos clientes, informando nome completo, endereço, rua, número, bairro, cidade, telefone de contato.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 02] Cadastro dos pets
A solução permitirá que o operador realize o cadastro dos pets, informando o dono, nome do pet, a espécie, raça, cor, porte, sexo, se é castrado, comportamento, cartão de vacina e saúde do pet.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 03] Criação de serviços
A solução permitirá a criação de novos serviços com os seguintes campos: nome do serviço, preço cobrado por cada Pet participante, descrição (opcional), foto (opcional), e categoria do serviço. As categorias podem incluir PS, DW, Saúde, Transporte, Hospedagem, Creche, PetCare, entre outras. Também permitirá adicionar restrições aos serviços, como restrição de espécies para o serviço ou restrição de participantes (individual ou coletivo), caso desejado.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 06] Cadastro de login
A solução permitirá o cadastro de login, no qual o operador ou administrador criará uma conta com identificação de usuário login, email e senha. A seleção de uma pergunta de segurança será exigida apenas para administradores.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 07] Funcionalidade de login
A solução permitirá que o Utilizador ou Administrador realize login utilizando um nome de usuário e senha ou email e senha.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 08] Recuperação de Senha
A solução permitirá que o Administrador recupere a senha por meio da resposta da pergunta de segurança previamente cadastrada.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 09] Redefinição de Senha
A solução permitirá a redefinição de senha apenas após o login, usando o processo de recuperação caso o Utilizador perca a senha.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 10] Histórico do pet
A solução permitirá visualizar o histórico do pet, sem a necessidade de informar a duração do serviço. O histórico incluirá informações sobre os serviços realizados, incluindo data, hora e detalhes do serviço.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 11] Alteração de dados
A solução permitirá a alteração dos dados da empresa, sistema ou instância, sendo que tais alterações poderão ser realizadas por qualquer operador com acesso ao console da empresa.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 12] Exclusão de dados
A solução permitirá a exclusão de dados, com a possibilidade de excluir agendamentos (se não concluídos ou preparados) e dados de serviços, funcionários, clientes e pets (desde que não estejam em uso).

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 13] Consulta de agendamentos
A solução permitirá a consulta ao histórico de agendamentos, com informações como dia, hora, funcionário responsável, pet, serviço realizado e observações adicionais. Será possível filtrar agendamentos por data, cliente e funcionário.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 17] Registro de incidentes
A solução permitirá o registro de incidentes, associando-os aos serviços realizados. O registro incluirá o tipo de incidente (emergência médica, brigas com outros pets, mau comportamento, agressão), pets envolvidos, data, hora, descrição do incidente e medidas tomadas.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 18] Relatório em PDF com informações de serviços prestados
A solução permitirá a geração de relatórios em PDF com as informações dos serviços prestados, mas sem incluir o endereço do cliente.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 19] Relatórios de desempenho de funcionários
A solução permitirá a geração de relatórios de desempenho de funcionários, com filtros de período e métricas ajustadas, removendo a métrica de tempo médio.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 20] Relatório financeiro
A solução permitirá a geração de relatórios financeiros, detalhando informações como valor gasto com funcionários e montante gerado por agendamentos. O relatório incluirá filtros de período.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 25] Suporte para múltiplos agendamentos por cliente
A solução permitirá o suporte para agendamentos recorrentes (semanal, mensal, trimestral). O operador poderá criar, visualizar, alterar e cancelar esses agendamentos recorrentes.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 28] Cancelamento de serviços
A solução permitirá o cancelamento de agendamentos, mantendo os dados no sistema e alterando apenas o estado do agendamento para "cancelado".

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 30] Gerenciamento de status do agendamento
A solução permitirá o gerenciamento do estado do agendamento, com estados como criado, preparado, concluído ou cancelado.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 31] Exportação de Dados
A solução permitirá a exportação de dados por administradores e empreendedores, conforme as permissões atribuídas.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 33] Lista de Clientes
A solução permitirá ao administrador e ao empreendedor consultar a lista de clientes cadastrados.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 34] Lista de Pets Cadastrados
A solução permitirá ao administrador visualizar a lista de pets cadastrados, sem detalhar as informações para cada consulta.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 35] Lista de Funcionários Cadastrados
A solução permitirá ao Utilizador consultar a lista de funcionários cadastrados.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 37] Visualização de Incidentes
A solução permitirá visualizar os incidentes registrados, incluindo todas as informações descritas no requisito de tipo de incidente.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

