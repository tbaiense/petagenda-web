# Especificação de Requisitos do Sistema
Versão: 0.4  
Data: 24 de março de 2025
<hr>  

## Termos
- Administrador - Provedores e mantenedores da solução;
- Utilizador ou Empreendedor – Beneficiado da solução, que acessa somente os dados pertencentes à Instância adquirida;
- “PetAgenda” – Nome da aplicação sendo executada;
- “Plataforma” - O sistema PetAgenda como um todo, contendo todas as Instâncias registradas, bem como o Console da Plataforma;
“Console” - Funcionalidade exclusiva aos Administradores onde é feita a gestão das informações e do acesso às Instâncias 
- “Instância” - Acesso individual do Empreendedor à Plataforma, onde é somente acessível as informações de sua empresa;
- Funcionário – Prestador de serviços do Empreendedor;
- Cliente – Beneficiado pelos serviços do Empreendedor;
- Pets – Animais Domésticos;
- “DW” – Dog Walkers (Passeadores de cães);
- “PS” – Pet Sitters (Cuidadores de pets);

## Requisitos Funcionais

### [RF 06] Cadastro de login
A solução permitirá o cadastro de login, no qual o Empreendedor ou Administrador criará uma conta informando email e senha. A senha deverá possuir entre 6 a 32 caracteres alfanumúricos. Esta nova conta terá as permissões comuns, disponíveis aos Utilizadores.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 07] Funcionalidade de login
A solução permitirá que o Empreendedor ou Administrador realize login utilizando email e senha cadastrados.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 08] Recuperação de Senha
A solução permitirá que o Administrador recupere a senha por meio da resposta da pergunta de segurança previamente cadastrada.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 09] Redefinição de Senha
A solução permitirá a redefinição de senha apenas após o login: o Administrador ou Utilizador informará a senha atual e a nova senha. A senha será redefinida somente se a senha atual for correta e a nova senha possuir os critérios necessários.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Console de gestão do sistema
O sistema deverá permitir que contas de Administrador acessem o console de gestão do sistema, onde Administradores poderão gerenciar contas cadastradas, gerenciar as licenças de acesso às instâncias, gerenciar cotas de utilização e gerenciar o perfil da conta do Administrador em questão.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Gestão de contas cadastradas
O sistema deverá permitir aos Administradores, através do console de gestão do sistema, gerenciar as contas cadastradas no sistema, permitindo:
- a listagem das contas cadastradas;
- a redefinição de senha de contas cadastradas;

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

### [RF nn] Licenças de acesso
O sistema deverá possuir dois tipos de licenças para acesso à Solução: "básica" e "profissional". Somente os Utilizadores que adquiriem uma licença possuirão acesso à Instância da Solução. Cada licença possuirá benefícios específicos, com relação às cotas de utilização.

### [RF nn] Cotas de utilização
O sistema irá registrar a quantidade de serviços executados e relatórios poderão ser gerados. Essa quantia será denominada "cota de utilização".  Contas com licença profissional não deverão sofrer contabilização das cotas de serviço.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cotas de serviço
A solução deverá manter um registro com a quantia de serviços executados poderão ser registrados pelas contas dos Utilizadores com licença básica, denominada "cota de serviço". No momento em que um agendamento tiver seu estado alterado para "concluído" ou um serviço executado for cadastrado manualmente, a cota de serviço deverá ser reduzida em 1.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Verificação de cotas de serviço
Se a licença atual da conta do Utilizador for a licença básica, a solução deverá verificar antes do cadastro de um agendamento e de serviço executado se a conta possui cotas de serviço disponíveis. Se houver cotas disponíveis, deverá ser permitido a criação do agendamento ou registro de serviço executado. Se não houver cotas disponíveis, uma mensagem de erro deverá ser exibida.

### [RF nn] Cotas de relatórios
A solução deverá manter um registro com a quantia de relatórios poderão ser registrados pelas contas dos Utilizadores, denominada "cota de relatório". No momento em que um relatório for gerado, a cota de relatório deverá ser reduzida em 1, de acordo com o tipo de relatório gerado.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Tipos de cota de relatório
A solução deverá distinguir entre dois tipos de cota de relatório: cota de relatório simples e cota de relatório detalhado. Cotas de relatório simples serão contabilizadas ao Utilizador gerar relatórios do tipo simples e cotas de relatório detalhado serão contabilizadas ao Utilizador gerar relatórios do tipo detalhado.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Verificação de cotas de relatório
A solução deverá verificar antes da geração de um relatório se a conta possui cotas de relatórios disponíveis para o tipo de relatório específico. Se houver cotas disponíveis, deverá ser permitido a geração do relatório. Se não houver cotas disponíveis, uma mensagem de erro deverá ser exibida.

### [RF nn] Geração automática de cotas
A solução deverá conceder 75 cotas de serviço e 2 cotas de relatório simples no momento em que o Utilizador adquirir ou renovar a licença básica. A solução também deverá conceder 12 cotas de relatório simples e 8 cotas de relatório detalhado no momento em que o Utilizador adquirir ou renovar a licença profissional.

### [RF nn] Gerenciamento de cotas pelo Administrador
A solução deverá permitir ao Administrador: consultar o número de cotas disponíveis por cada conta de Utilizador, adicionar cotas, remover cotas e alterar a quantia de cotas.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Gerenciamento de cotas pelo Empreendedor
A solução deverá permitir ao Empreendedor consultar a quantidade de cotas que possui e solicitar mais.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cadastro de dados adicionais da empresa do Empreendedor
O sistema deverá permitir opcionalmente o cadastro das informações da empresa, que poderão ser usados na emissão de nota fiscal. Os dados serão razão social, nome fantasia, cnpj e endereço, contendo logradouro, número, bairro, cidade e estado.

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
A solução permitirá ao operador realizar o cadastro dos clientes, informando nome completo, telefone de contato e endereço, contendo logradouro, número, bairro, cidade e estado.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 33] Lista de Clientes
A solução permitirá ao Empreendedor consultar a lista de clientes cadastrados.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 02] Cadastro dos pets
A solução permitirá que o operador realize o cadastro dos pets, informando o dono, nome do pet, a espécie, raça, cor, porte, sexo, se é castrado, comportamento, cartão de vacina e saúde do pet.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 34] Lista de Pets Cadastrados
A solução permitirá ao Empreendedor visualizar a lista de pets cadastrados, sem detalhar as informações para cada consulta.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 03] Criação de serviços
A solução permitirá a criação de novos serviços com os seguintes campos: nome do serviço, preço cobrado por cada Pet participante, descrição (opcional), foto (opcional) e a categoria do serviço. Também permitirá adicionar restrições aos serviços, como restrição de espécies para o serviço e/ou restrição de participantes (individual ou coletivo), caso desejado.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Categorias de serviço
O sistema deverá permitir ao Utilizador a atribuição de categorias de serviço a determinados serviços. As categorias disponíveis serão: Pet Sitting, Passeio, Saúde, Transporte, Hospedagem, Creche e PetCare.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Serviços executados
A solução deverá permitir o registro de um serviço realizado. Poderá ser gerado manualmente pelo Utilizador por meio de cadastro manual ou automaticamente, ao atribuir o estado de "concluído" ao agendamento.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cadastro de serviços executados
A solução deverá permitir o cadastro de serviços executados. As informações que deverão estar contidas serão:
- os pets participantes do serviço;
- o serviço agendado;
- a data e hora de início do serviço;
- a data e hora de finalização do serviço;
- o endereço onde o Pet foi buscado, se aplicável;
- o endereço de devolução do pet, se aplicável;
- o funcionário atribuído;
- observações do serviço, opcionalmente;
- os remédios que foram administrados, se aplicável;
- o horário de administração, nome do remédio e instrução de administração de cada remédio, se aplicável;
- os horários de alimentação, se aplicável;
- as instruções de alimentação, se aplicável;
- incidentes, se aplicável;

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Cadastro de agendamento de serviços
A solução deverá permitir o cadastro de agendamentos de serviços, requerindo as seguintes informações:
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

A solução deverá definir o estado inicial de um agendamento recém criado como "criado" se o funcionário atribuído não for informado. Se o funcionário atribuído for informado, a solução deverá definir o estado do agendamento como "preparado".

Prioridade:  (X)Essencial  ( )Importante  ( )Desejável

### [RF nn] Definição do funcionário atribuído para agendamento
A solução deverá permitir a definição ou alteração do funcionário atribuído para um serviço agendado durante o cadastro do agendamento ou após sua criação. Ao atribuir um funcionário para um agendamento já existente e com o estado "criado", a solução deverá alterar seu estado para "preparado".

### [RF 30] Controle do estado do agendamento
A solução permitirá a controle do estado do agendamento. Os estados possíveis serão: "criado", "preparado", "pendente", "concluído" ou "cancelado". Esses estados serão gerenciados pela solução automaticamente.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Atribuição automática de estados de agendamento
O sistema deverá atribuir estados aos agendamentos automaticamente dependendo das ações do Utilizador:
- O estado "criado" será atribuído a agendamentos cadastrados, mas sem funcionário atribuído;
- O estado "preparado" será atribuído a agendamentos cadastrados e com funcionário atribuído; 
- O estado "pendente" será atribuído a agendamentos com estado de "preparado" que ultrapassaram a data e hora agendadas, mas ainda não tiveram o estado atualizado para "concluído" ou "cancelado"; 
- O estado "concluído" será atribuído para agendamentos com estado prévio "preparado" ou "pendente" que foram marcados como concluídos pelo Utilizador; 
- O estado "cancelado" será atribuído a agendamentos cadastrados que foram cancelados pelo Utilizador ou a agendamentos com estado "criado" que ultrapassaram a data e hora de agendamento;

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Conclusão de agendamentos
A solução deverá permitir ao Utilizador marcar agendamentos com o estado "preparado" ou "pendente" como concluídos. Ao concluir um agendamento, a solução deverá alterar o estado do agendamento para "concluído", gerar um registro de serviço executado utilizando as informações do agendamento, definir a data e hora atual como a data de finalização.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 28] Cancelamento de agendamentos
A solução permitirá ao Utilizador o cancelamento de agendamentos que ainda não possuem o estado "concluído", mantendo os dados no sistema. Ao cancelar um agendamento, a solução deverá alterar o estado do agendamento para "cancelado".

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 13] Consulta de agendamentos
A solução permitirá a consulta ao histórico de agendamentos, com informações como dia, hora, funcionário responsável, pet, serviço realizado e observações adicionais. Será possível filtrar agendamentos por data, cliente, funcionário e estado do agendamento.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 25] Suporte para múltiplos agendamentos por cliente
A solução permitirá o suporte para agendamentos recorrentes, onde o sistema cadastrará os agendamentos automaticamente para o período definido. O operador poderá criar, visualizar, alterar e cancelar esses agendamentos recorrentes. Os pacotes de agendamento possuirão três possíveis estados: "ativo", "concluído" ou "cancelado".

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Criação de agendamentos recorrentes
A solução permitirá o cadastro de agendamentos recorrentes, requerendo como informações necessárias:
- o serviço requerido;
- os pets participantes;
- a data de início dos agendamentos;
- a frequência dos agendamentos, sendo semanal ou mensal;
- os dias dentro da semana ou mês;
- a data final dos agendamentos;

Ao criar um novo pacote de agendamentos recorrentes, a solução deverá atribuir o estado do pacote como "ativo".

### [RF nn] Visualização de agendamentos recorrentes
A solução deverá permitir a visualização dos agendamentos recorrentes em estado "ativo" para determinado cliente, exibindo os agendamentos de forma organizada.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Conclusão de pacote de agendamentos recorrentes
A solução deverá alterar o estado de determinado pacote de agendamentos para "concluído" quando o último agendamento for concluído.

### [RF nn] Cancelamento de agendamentos recorrentes
A solução deverá permitir o cancelamento de agendamentos recorrentes de determinado cliente, marcando todos os agendamentos com o estado de "criado" ou "preparado" como "cancelado" e atualizando pacote de agendamento para o estado de "cancelado".

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

### [RF 31] Exportação de Dados
A solução permitirá a exportação de dados por Administradores e Empreendedores, conforme as permissões atribuídas.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 17] Registro de incidentes
A solução permitirá o registro de incidentes, associando-os aos serviços realizados. O registro incluirá o tipo de incidente (emergência médica, brigas com outros pets, mau comportamento, agressão), pets envolvidos, data, hora, descrição do incidente e medidas tomadas.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 37] Visualização de Incidentes
A solução permitirá visualizar os incidentes registrados, incluindo todas as informações descritas no requisito de tipo de incidente.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 18] Exportação do registro de informações de serviços prestados
A solução permitirá a exportação em PDF das informações dos serviços prestados, sem incluir o endereço do cliente.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Registro mensal de gastos com pagamento de colaboradores
A solução permitirá o registro de gasto mensal com pagamento de funcionários, informando o mês referente e a quantia gasta em Reais.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Geração de relatórios
A solução deverá permitir ao Utilizador a geração de relatórios simples e detalhados, de acordo com a quantidade de cotas disponíveis para cada tipo de relatório.

### [RF 20] Relatório simples financeiro
A solução permitirá a geração de relatórios simples financeiro, detalhando informações como valor gasto com funcionários e montante gerado por serviços executados. O relatório incluirá filtros de período.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 19] Relatório detalhado de desempenho de funcionários
A solução permitirá a geração de relatórios detalhados de desempenho de funcionários, com filtros de período e métricas ajustadas.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF 19] Relatório detalhado de desempenho de serviços
A solução permitirá a geração de relatórios detalhados de desempenho de serviço, informando quais os serviços mais executados em determinado período de tempo e ordem descendente.

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