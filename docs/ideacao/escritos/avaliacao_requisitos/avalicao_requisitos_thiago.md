# Avaliação dos requisitos anteriores
Ponto de vista: Thiago

## Comentários geral
- Mover requisitos RF06 e RF07 para não-funcionais de segurança e inverter a ordem

## Propostas de novos requisitos

- Cotas de uso: agendamento e relatórios
	+ Acúmulo de relatórios não utilizados.
	
	+ Cotas de agendamento: funcionamento e contabilização.
		* Gerenciamento de cotas de agendamento pelo administrador: verificar, adicionar, remover e alterar cotas de agendamento das empresas cadastradas.
		
	+ Cotas de relatórios: funcionamento, contabilização e solicitação.
		+ Gerenciamento de cotas de relatórios pelo administrador: verificar, adicionar, remover e alterar cotas de relatórios das empresas cadastradas.
	
- Estados de agendamento: criado, preparado, concluído ou cancelado.

- Criação de serviços: nome do serviço, preço, descriço opcional, foto opcional, etc.
	+ Atribuição de categorias a serviços criados.
	
	+ Categorias de serviço: PS, DW, Saúde, Transporte, Hospedagem, Creche, PetCare, etc.

	+ Adição de restrições à serviços
		* Restrição de espécies para serviço: criar um serviço que só é exibido como disponível para agendamento se for compatível com a espécie do pet.
		* Restrição de participantes: serviço individual ou coletivo (passeios)
- Exclusão de dados de agendamentos (permitir se não for concluído ou preparado).

- Exclusão de dados de serviços, funcionários, clientes e pets.

- **Definição de dos dados da empresa do empreendedor**, dos dados de todas as empresas, do sistema como um todo. Talvez chamar de instância o sistema que é fornecido aos empresários?

- Controle de acesso à plataforma dos empreendedores: gerenciamento de acesso dos empreendedores, aprovar licenças, revogar licenças, remover contas de utilizadores.
- Controle dos dados das empresas cadastradas: remover todos os dados das empresas.

- Recuperação de acesso dos empreendedores feito pelo administrador: renovar senha.

- Painel do administrador: Controle de dados, Recuperação de acesso, Gerenciamento de cotas de agendamento e relatórios.

- Cadastro de agendamento: os campos que existirão e o que deve ser colocado, independente do serviço a ser agendado. Atualmente o requisito distingue entre dois tipos 'Dog Walker' e 'Pet Sitting':
	> 3.1.4 [RF 04] Agendamento de horários para Dog Walkers  
	> 3.1.5 [RF 05] Agendamento de horários para Pet Sitters

	Depois fazer os requisitos separados para determinar as informações exclusivas de um tipo de serviço.
	
	+ 

- Exportação de histórico do pet para csv

- Filtragem de históricos por data início e fim

- Mecanismo de pesquisa em históricos

- Busca de endereços por CEP

- Estado de disponibilidade de funcionário: Definido manualmente ou automaticamente, se o serviço em que o funcionário atribuído for individual. Interpretá-lo como disponível fora dos períodos especificados.

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

- Criar novo requisito: agenda de funcionário

### 3.1.16 [RF 16] Bloqueio de agendamentos em horários conflitantes
- Sugiro descartar requisito. Permitir independente da indisponibilidade do funcionário, mas destacar o conflito para serviços individuais.

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
- 


