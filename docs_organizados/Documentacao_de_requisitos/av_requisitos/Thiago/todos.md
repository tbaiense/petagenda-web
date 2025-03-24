# Especificação de Requisitos do Sistema
Versão: 0.4  
Data: 24 de março de 2025
<hr>  

## Requisitos Funcionais

### [RF 06] Cadastro de login
A solução permitirá o cadastro de login, no qual o operador ou administrador criará uma conta com identificação de usuário login, email e senha. A seleção de uma pergunta de segurança será exigida apenas para administradores. A primeira conta a ser cadastrada no sistema será uma conta do tipo Administrador.

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

### [RF nn] Console de gestão do sistema
O sistema deverá permitir que contas de Administrador acessem o console de gestão do sistema, onde Administradores poderão gerenciar contas cadastradas, gerenciar as licenças de acesso às instâncias, gerenciar cotas de utilização e gerenciar o perfil da conta do Administrador em questão.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Gestão de contas cadastradas
O sistema deverá permitir aos Administradores, através do console de gestão do sistema, gerenciar as contas cadastradas no sistema, permitindo:
- a listagem das contas cadastradas;
- a concessão de privilégio de Administrador a uma conta cadastrada;
- a redefinição de senha de contas cadastradas;
- a remoção de contas cadastradas;

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Gestão de licenças de acesso
O sistema deverá permitir aos Administradores, através do console de gestão do sistema, gerenciar as licenças de acesso às instâncias do sistema, permitindo:
- conceder licenças de acesso;
- revogar licenças de acesso;
- prolongar licenças de acesso;

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Gestão do perfil do Administrador
O sistema deverá permitir aos Administradores, através do console de gestão do sistema, gerenciar o perfil do Administrador em questão, permitindo:
- alterar o email utilizado;
- alterar a senha utilizada;

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cotas de utilização
**Completar**: Contabilização de cotas de agendamento, serviço executado e relatórios. Acúmulo de cotas não utilizadas.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cotas de cadastro de agendamento e cadastro de serviço executado
**Completar**: funcionamento e contabilização (não contabilizar registros de serviços executados caso sejam originários de agendamento.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cotas de geração de relatórios
**Completar**: funcionamento, contabilização e solicitação.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Gerenciamento de cotas pelo Administrador
**Completar**: Verificar, adicionar, remover e alterar cotas de agendamento e execução de serviços das empresas cadastradas.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Gerenciamento de cotas pelo Empreendedor
**Completar**: Verificar e solicitar mais.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cadastro de dados adicionais da empresa do Empreendedor
**Completar**: Descrição dos dados inseridos durante o cadastro opcional das informações da empresa, usados na emissão de nota fiscal. Razão social, nome fantasia, cnpj, local, cnae, etc.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cadastro de funcionários
A solução permitirá ao operador realizar o cadastro dos funcionários, informando nome completo, telefone de contato e opcionalmente os tipos de serviços exercidos.

Prioridade:  ( )Essencial  (X)Importante  ( )Desejável

### [RF 35] Lista de Funcionários Cadastrados
A solução permitirá ao Utilizador consultar a lista de funcionários cadastrados.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Atribuição de estado de disponibilidade de funcionário
A solução deverá permitir a atribuição manual do estado de disponibilidade "reservado" a um funcionário para determinada faixa de horário, em um dia específico. O Utilizador deverá informar o funcionário, o dia respectivo e o horário de início e fim de validade do estado. A Solução deverá permitir ao Usuário remover o estado de "reservado" de determinado dia e faixa de horário. O estado de disponibilidade do funcionário deverá ser interpretado pela Solução como "disponível" nos dias e nas faixas de horário onde não estiver atribuído como "reservado".

Prioridade:  ( )Essencial  (x)Importante  ( )Desejável

### [RF 01] Cadastro de clientes
A solução permitirá ao operador realizar o cadastro dos clientes, informando nome completo, endereço, rua, número, bairro, cidade, telefone de contato.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 33] Lista de Clientes
A solução permitirá ao administrador e ao empreendedor consultar a lista de clientes cadastrados.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 02] Cadastro dos pets
A solução permitirá que o operador realize o cadastro dos pets, informando o dono, nome do pet, a espécie, raça, cor, porte, sexo, se é castrado, comportamento, cartão de vacina e saúde do pet.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 34] Lista de Pets Cadastrados
A solução permitirá ao administrador visualizar a lista de pets cadastrados, sem detalhar as informações para cada consulta.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 03] Criação de serviços
A solução permitirá a criação de novos serviços com os seguintes campos: nome do serviço, preço cobrado por cada Pet participante, descrição (opcional), foto (opcional), e categoria do serviço. As categorias podem incluir PS, DW, Saúde, Transporte, Hospedagem, Creche, PetCare, entre outras. Também permitirá adicionar restrições aos serviços, como restrição de espécies para o serviço ou restrição de participantes (individual ou coletivo), caso desejado.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Categorias de serviço
**Completar**: Descrição do uso na filtragem por serviços. Significado de PS, DW, Saúde, Transporte, Hospedagem, Creche, PetCare, etc.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cadastro de agendamento de serviços
**Completar**: A solução deverá permitir o cadastro de agendamentos de serviços, requerindo as informações comuns a todos as categorias de agendamentos e dados específicos à categoria atribuída ao serviço selecionado, se aplicável.

Os dados que deverão ser informados em quaisquer cadastramento de agendamento serão:
- os pets participantes do agendamento;
- o serviço agendado;
- a data e hora marcadas para início do serviço;
- o endereço onde o Pet deverá ser buscado, se aplicável;
- o endereço de devolução do pet, se aplicável;
- o funcionário atribuído, opcionalmente informado após o cadastramento;
- observações do agendamento, opcionalmente;
- os remédios que deverão ser administrados, se aplicável;
- o horário de administração, nome do remédio e instrução de administração de cada remédio, se aplicável;
- os horários de alimentação, se aplicável;
- as instruções de alimentação, se aplicável;

Prioridade:  (X)Essencial  ( )Importante  ( )Desejável

### [RF 25] Suporte para múltiplos agendamentos por cliente
A solução permitirá o suporte para agendamentos recorrentes (semanal, mensal, trimestral). O operador poderá criar, visualizar, alterar e cancelar esses agendamentos recorrentes.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 30] Gerenciamento de status do agendamento
A solução permitirá o gerenciamento do estado do agendamento, com estados como criado, preparado, concluído ou cancelado.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 28] Cancelamento de agendamentos
A solução permitirá o cancelamento de agendamentos, mantendo os dados no sistema e alterando apenas o estado do agendamento para "cancelado".

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Visualização de agendamentos recorrentes.
Descrição do requisito.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cancelamento de agendamentos recorrentes
Descrição do requisito.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Serviços executados
**Completar**: Descrição de um registro de um serviço realizado, seja ele agendado ou não. Data, hora, funcionário, pets participantes, etc. Poderá ser gerado manualmente pelo Utilizador por meio de cadastro ou automaticamente, ao atribuir o estado de "concluído" ao agendamento.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cadastro manual de serviços executados
**Completar**: Descrição de um registro de um serviço realizado, seja ele agendado ou não. Informar dados comuns a todos os serviços e específicos de categorias de serviços, se aplicável. Descrição do processo, serviço executado, se foi agendado, data e hora de finalização, data e hora de início, incidentes, observações, pets envolvidos, tutor responsável)

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cadastro automático de serviços executados
**Completar**: Gerado pelo sistema ao alterar o estado de um agendamento para "concluído". **?Gerar um registro para um pet, se serviço do agendento tiver restrição "individual" de participantes. Gerar um resgistro contendo todos os pets participantes, se serviço do agendamento for "coletivo"?**

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 13] Consulta de agendamentos
A solução permitirá a consulta ao histórico de agendamentos, com informações como dia, hora, funcionário responsável, pet, serviço realizado e observações adicionais. Será possível filtrar agendamentos por data, cliente e funcionário.

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

### [RF 31] Exportação de Dados
A solução permitirá a exportação de dados por administradores e empreendedores, conforme as permissões atribuídas.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 37] Visualização de Incidentes
A solução permitirá visualizar os incidentes registrados, incluindo todas as informações descritas no requisito de tipo de incidente.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

## Requisitos Não funcionais

### [RNF 01] Simplicidade do sistema
A solução deve ser intuitiva e fácil de usar, com uma interface limpa e acessível, especialmente para operadores e administradores.

### [RNF 02] Backup de Dados
A solução deverá realizar backups automáticos dos dados, garantindo a integridade e segurança da informação.

### [RNF 08] Feedback visual
A solução deve fornecer feedback visual claro e informativo, alterando a referência de "administrador" para "operador".

### [RNF 12] Sistema de usuário
Este requisito será renomeado para "Navegação do operador" e deverá utilizar "operador" no lugar de "usuário".

### [RNF 14] Sistema de busca por clientes e pets
A solução permitirá a busca por clientes e pets com filtragem, alterando a referência de "usuário

### [RNF nn] Validação de endereços
A solução deverá verificar as informações de endereço, impedindo o Utilizador de cadastrar um endereço contendo caracteres especiais, como "!", "@", "#", "$", e outros.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RNF nn] Exibição de serviços selecionáveis
A Solução deverá exibir com prioridade os serviços que sejam compatíveis com os Pets adicionados durante o cadastro de agendamentos e serviços realizados, verificando as restrições existentes em cada serviço listado. Os serviços incompatíveis deverão ser listados, mas com a menor prioridade.

Prioridade:  ( )Essencial  ( )Importante  (x)Desejável

### [RNF nn] Seleção de serviços para agendamento e cadastro manual de serviço executado
A solução deverá garantir o cumprimento das restrições do serviço selecionado para um agendamento ou serviço executado, verificando as espécies e a quantidade de Pets participantes do mesmo dono. Ao Utilizador selecionar um serviço com restrições incompatíveis com os pets participantes, a Solução deverá exibir uma mensagem de erro informando o motivo. Se o serviço em questão possuir ambas as restrições de espécie e número de participantes definidas, a Solução deverá garantir que todos os particantes sejam da mesma espécie.

Prioridade:  ( )Essencial  ( )Importante  (x)Desejável

### [RNF nn] Restrição de espécies para serviço
Esta restrição limita as espécies que poderão ser atendidas  pelo serviço, podendo ser um ou mais.

Prioridade:  ( )Essencial  ( )Importante  (x)Desejável

### [RNF nn] Restrição de participantes
Esta restrição limita a quantidade de pets partipantes do mesmo dono que poderão ser adicionados a um mesmo serviço executado ou agendamento. A restrição deverá considerar apenas uma das duas opções seguintes como válidas para um serviço: "individual" e "coletivo". A restrição "individual" limita o serviço a conter apenas 1 (um) Pet do mesmo dono em cada agendamento ou serviço executado. A restrição "coletivo" permite o  serviço a conter 1 (um) ou mais Pets do mesmo dono em cada agendamento ou serviço executado.

Prioridade:  ( )Essencial  ( )Importante  (x)Desejável

### [RNF nn] Inclusão de pets participantes em um agendamento ou serviço executado
Ao Utilizador adicionar Pets participantes durante o cadastro de um agendamento ou serviço executado, a Solução deverá garantir o cumprimento das restrições do serviço selecionado, caso ele já tenha sido definido. Uma mensagem de erro deverá ser exibida ao Utilizador tentar violar uma restrição do serviço adicionado, impedindo a adição do Pet.

Prioridade:  ( )Essencial  ( )Importante  (x)Desejável

### [RNF nn] Verificação da disponibilidade de funcionário em agendamentos
Durante a atribuição de um funcionário a um agendamento, a solução verificará se o estado de disponibilidade do funcionário se encontra como "disponível" para o dia e horário agendados. Caso o estado de disponibilidade verificado do funcionário esteja como "reservado", a solução deverá notificar ao Utilizador da possibilidade de sobreposição de horário, mas permitir a atribuição, caso o Utilizador deseje.

Prioridade:  ( )Essencial  (x)Importante  ( )Desejável

### [RNF nn] Destaque de agendamentos com sobreposição de horário
Ao exibir a agenda do funcionário ou ao exibir os agendamentos futuros, a solução deverá destacar agendamentos com restrição "individual" de participantes de um mesmo funcionário que estejam marcados para um mesmo horário e dia, exibindo-os com uma cor que chame atenção do Utilizador.

Prioridade:  ( )Essencial  ( )Importante  (x)Desejável