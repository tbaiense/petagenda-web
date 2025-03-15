# Avaliação dos requisitos anteriores
Ponto de vista: Thiago.

## Comentários gerais
- Mover RF06, RF07, RF18, RF29, RF31 para RNF.

- Definir _instância_ como o sistema que é fornecido aos empresários.

- Renomear usuário ou utilizador para _operador da instância_.

- Esclarecer e definir os termos _agendamento_ e _serviço realizado_.

## Propostas de novos requisitos

- Cotas de uso: agendamento e relatórios
	+ Acúmulo de relatórios não utilizados.
	
	+ Cotas de agendamento e serviço executado: funcionamento e contabilização (não contabilizar registros de serviços executados caso sejam originários de agendamento).
		* Gerenciamento de cotas de agendamento e execução de serviços pelo administrador: verificar, adicionar, remover e alterar cotas de agendamento e execução de serviços das empresas cadastradas.
		
	+ Cotas de relatórios: funcionamento, contabilização e solicitação.
		+ Gerenciamento de cotas de relatórios pelo administrador: verificar, adicionar, remover e alterar cotas de relatórios das empresas cadastradas.

- Criação de serviços: nome do serviço, preço, descrição opcional, foto opcional, etc.
	+ Atribuição de categorias a serviços criados.
	
	+ Categorias de serviço: PS, DW, Saúde, Transporte, Hospedagem, Creche, PetCare, etc.

	+ Adição de restrições à serviços
		* Restrição de espécies para serviço: criar um serviço que só é exibido como disponível para agendamento se for compatível com a espécie do pet.
		* Restrição de participantes: serviço individual ou coletivo (passeios)
- Exclusão de dados de agendamentos (permitir se não for concluído ou preparado).

- Exclusão de dados de serviços, funcionários, clientes e pets: apenas se não estiverem em uso

- **Definição dos dados da empresa do empreendedor**, dos dados de todas as empresas, do sistema como um todo.

- Controle de acesso à plataforma dos empreendedores: gerenciamento de acesso dos empreendedores, aprovar licenças, revogar licenças, remover contas de utilizadores.
- Controle dos dados das empresas cadastradas: remover todos os dados das empresas.

- Recuperação de acesso dos empreendedores: feito pelo administrador. apenas renovar senha (trocar a senha por uma nova).

- Painel do administrador: Controle de dados, Recuperação de acesso, Gerenciamento de cotas de agendamento e relatórios.

- Serviços executados: registro de um serviço realizado, seja ele agendado ou não. Detalhar informações contidas.

- Cadastro manual de serviço executado: descrição do processo e as informações necessárias (serviço executado, se foi agendado, data e hora de finalização, data e hora de início, incidentes, observações, pets envolvidos, tutor responsável)

- Cadastro de agendamento: os campos que existirão e o que deve ser colocado, independente do serviço a ser agendado. Lembrar de mencionar a possibilidade de vários pets participantes. Gerar registro de serviço realizado automaticamente ao concluir o agendamento usando as informações do agendamento.
	
- Gerenciamento de agendamentos recorrentes: criar, visualizar, alterar.
	+ Modalidades de agendamento recorrente (semanal, mensal, trimestral).
	+ Criação de agendamentos recorrentes: necessária atribuição manual de funcionário ao agendamento.
	+ Visualização de agendamentos recorrentes.
	+ Alteração de agendamentos recorrentes.
	+ Cancelamento de agendamentos recorrentes (antes e após o prazo estipulado).
	
- Agenda do funcionário: visualizar serviços, marcar definir disponibilidade (estipular período)

- Estado de disponibilidade de funcionário: Definido manualmente ou automaticamente, se a restrição de participantes do serviço em que o funcionário estiver atribuído for individual. Interpretá-lo como disponível fora dos períodos especificados.

- Exportação de histórico do pet para csv

- Filtragem de históricos por data início e fim, estado do agendamento

- Mecanismo de pesquisa em históricos

- Busca de endereços por CEP

- Tipos de incidentes: emergência médica, brigas com outros pets, mal comportamento, agressão. Explicar significado de cada um.

- Controle do estado do cliente: controle de inatividade, período necessário para considerar inativo

- Geração de notificações: quais serão geradas e o que irá gerá-las.
	+ Gestão de notificações: visualização e remoção.


## Comentários por partes

### 3.1.4 [RF 04] Agendamento de horários para Dog Walkers
- Descartar menção à agenda do func. e comportamento

- Funcion. de agend. para DW deve permitir alocar qualquer funcionário

- ?Funcion. de agend. deve permitir adição de mais de um pet para um mesmo dono?

- Descrever com mais clareza o que deve ser informado para um cadastro de agend. DW

### 3.1.5 [RF 05] Agendamento de horários para Pet Sitters
- Descartar menção à agenda do func. e comportamento

- Funcion. de agend. para PS deve permitir alocar qualquer funcionário

- Incluir campo de instruções de alimentação e de remédios

- Descrever com mais clareza o que deve ser informado para um cadastro de agend. PS

### 3.1.6 [RF 06] Cadastro de login
- Remover necessidade de CPF

- Cadastro com identificação de usuário (login ou nickname), email e senha

- Incluir a seleção da pergunta de segurança apenas para o administrador

### 3.1.7 [RF 07] Funcionalidade de login
- Remover CPF

- Login com usuário e senha ou email e senha

### 3.1.8 [RF 08] Recuperação de Senha
- Pergunta de segurança apenas para o administrador

- Recuperação de senha gera redefinição

### 3.1.9 [RF 09] Redefinição de Senha
- Remover CPF

- Redefinição apenas depois de logado (usar recuperação quando perder)

### 3.1.10 [RF 10] Histórico do pet
- Tirar duração do serviço

### 3.1.11 [RF 11] Alteração de dados
- Especificar a quais dados o requisito se refere: dados da empresa, dados do sistema como um todo?

- Alterações dos dados da empresa devem ser possíveis de serem feitas por qualquer utilizador com acesso ao console da empresa

### 3.1.12 [RF 12] Exclusão de dados
- Especificar a quais dados o requisito se refere: dados da empresa, dados do sistema como um todo?

- Recomendo separar o requisito em outros: exclusão de agendamentos e exclusão de serviços, funcionários, clientes e pets

- Definição geral do que pode ser excluído: exclusão de _alguns_ dados da empresa devem ser possíveis de serem feitas por qualquer utilizador com acesso à instância

### 3.1.13 [RF 13] Consulta de agendamentos
- Renomear para "Histórico de agendamentos", para ficar consistente com RF10 e RF36.

- Separar opções de filtro mencionadas (clientes e funcionários) em requisito separado. Mencionar apenas o que será contido no histórico.

- Descrever as informações disponíveis em cada item do histórico: dia, hora, funcionário, pet, serviço realizado, informações adicionais (se houverem incidentes, observações, etc).

- Destacar agendamentos de serviços individuais em horários conflitantes para um mesmo funcionário.

### 3.1.14 [RF 14] Validação de endereços 
- Referir-se ao empresário, ao invés de ao administrador.
- Não checar a validade do local, mas apenas a formatação

### 3.1.15 [RF 15] Verificação da disponibilidade de funcionário
- Sugiro reformular completamente o requisito: ao iniciar o cadastro de um novo agendamento, o sistema irá verificar se o funcionário possui ou não o estado de "disponível" para o horário selecionado, e alertar ao utilizador sobre a indisponibilidade caso esteja como "indisponível", mas não impedir o cadastro.
>※ O estado de indísponibilidade deve ser atribuído manualmente pelo funcionário (novo requisito).

### 3.1.16 [RF 16] Bloqueio de agendamentos em horários conflitantes
- Sugiro descartar requisito. Permitir independente da indisponibilidade do funcionário, mas destacar o conflito para serviços individuais.

###  3.1.17 [RF 17] Registro de incidentes
- Alterar referência de administrador para operador.

- Deverá ser registrado contendo associação com um serviço realizado.

- Especificar as informações que o incidente irá conter: tipo do incidente (emergência médica, brigas com outros pets, mal comportamento, agressão), pets envolvidos, data e hora, descrição (ou relato) e medida tomada.

- Separar tipo de incidente em outro requisito e explicar o propósito de cada tipo.

### 3.1.18 [RF 18] Relatório em PDF com informações de serviços prestados
- Não exibir endereço do cliente.

### 3.1.19 [RF 19] Relatórios de desempenho de funcionários
- Mudar referência de administrador para empreendedor.

- Remover métrica de tempo médio.

- Adicionar filtro de período.

### 3.1.20 [RF 20] Relatório financeiro
- Detalhar as informações contidas no relatório: valor gasto com funcionários, montante gerado por agendamentos.

- Filtro por período

### 3.1.22 [RF 22] Estatísticas de utilização do sistema
- Descartar

### 3.1.25 [RF 25] Suporte para múltiplos agendamentos por cliente
- Renomear para "Suporte para agendamentos recorrentes"

- Especificar as informações básicas de um agendamento recorrente.

- Detalhar a funcionalidade em requisitos em separados: 
	+ Descrição das modalidades de agendamento recorrente (semanal, mensal, trimestral).
	+ Criação de agendamentos recorrentes, visualização de agendamentos recorrentes
	+ Alteração de agendamentos recorrentes.
	+ Cancelamento de agendamentos recorrentes (antes e após o prazo estipulado).
	
### 3.1.26 [RF 26] Agendamento de múltiplos pets
- Tornar explícito que todos os pets participarão de um mesmo registro de agendamento.

### 3.1.28 [RF 28] Cancelamento de serviços 
- Renomear para "Cancelamento de agendamentos".

- Alterar referência ao cliente para operador.

- Especificar que os dados permanecerão no sistema, mas apenas o estado do agendamento será cancelado.

### 3.1.30 [RF 30] Gerenciamento de status do serviço
- Renomear para "Gerenciamento do estado do agendamento".

- Estados de agendamento: criado (sem funcionário atribuído), preparado (com funcionário atribuído), concluído ou cancelado.

### 3.1.32 [RF 32] Backup e Restauração de Dados 
- Descartar o requisito

### 3.1.34 [RF 34] Lista de Pets Cadastrados
- Trocar por "A solução permitirá" na seguinte parte:
> _A solução poderá exibir uma lista_ [...]

- Remover a parte:
> [...] _especificando também as informações necessárias para cada consulta._

### 3.1.35 [RF 35] Lista de Funcionários Cadastrados
- Remover referência ao CPF e endereço.

### 3.1.37 [RF 37] Visualização de Incidentes
- Remover repetição da palavra "descrição".

- Detalhar as informações contidas no incidente levando em consideração a proposta do novo requisito de tipo incidentes.

### 3.2.1 [RNF 01] Simplicidade do sistema
- Descartar ou reformular requisito: está genérico (não descreve com precisão o que deve estar presente para garantir a _simplicidade_).

- Válido a menção da língua principal do sistema, mas não é relacionado à simplicidade, mas sim à acessibilidade. Separar ou mover para outro RNF.

### 3.2.2 [RNF 02] Backup de Dados
- Descartar backup automático.

- Mover registro de transações (log) para novo RNF e especificar quais registros serão contidos e o formato esperado.

### 3.2.3 [RNF 03] Ferramentas de otimização de rotas
- **DESCARTAR!!** 😡

### 3.2.4 [RNF 04] Atribuição de Dog Walkers e Pet Sitters
- Descartar².

### 3.2.5 [RNF 05] Facilidade de instalação
- Reformular para "Tour de utilização" ou descartar: um tour guiado pelas as principais funções do sistema.

### 3.2.6 [RNF 06] Controle de erros
- Descartar.

### 3.2.7 [RNF 07] Disponibilidade offline
- Descartar.

### 3.2.8 [RNF 08] Feedback visual
- Alterar referência do "administrador' para "operador".

### 3.2.10 [RNF 10] Sistema de ajuda
- Descartar

### 3.2.12 [RNF 12] Sistema de usuário
- Renomear para "Navegação do operador".

- Mudar referência de "usuário" para "operador".

### 3.2.13 [RNF 13]  Feedback em tempo real
- Descartar: idêntico ao RNF 08.

### 3.2.14 [RNF 14] Sistema de busca por clientes e pets
- Mudar referência de "usuário" para "operador".

- Remover opção de busca por CPF (não será registrado, como não decidimos não constará no requisito).

- Mencionar a opção de filtragem, referenciando o requisito relacionado.

### 3.2.15 [RNF 15] Relatório de clientes inativos
- Mudar referência de "usuário" para "operador".

### 3.2.16 [RNF 16] Definição de feriados e indisponibilidade geral
- Mudar referência de "usuário" para "operador".

### 3.2.17 [RNF 17] Modo de visualização de calendário
- Mudar referência de "usuário" para "operador".

- Incluir menção a demais categorias de serviços.

### 3.2.18 [RNF 18] Definição de Preferências de Notificação
- Descartar

- Criar novo requisito para descrever as notificações que serão geradas e o que irá gerá-las.

### 3.2.19 [RNF 19] Personalização de Serviços
- Descartar: já mencionado no serviço de PS

### 3.2.20 [RNF 20] Alteração de paleta do layout
- Descartar