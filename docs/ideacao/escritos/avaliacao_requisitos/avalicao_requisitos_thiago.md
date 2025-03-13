# Avaliação dos requisitos anteriores
Ponto de vista: Thiago

## Comentários geral
- Mover requisitos RF06 E RF07 para não-funcionais de segurança E inverter a ordem

## Propostas de novos requisitos

1. Painel do administrador: liberar acesso de empresas à plataforma, remover acesso,
incrementar cotas de agendamento e relatórios

2. Deve existir um **novo requisito** tratando apenas da **funcionalidade de agendamento**.
Descrever os campos que existirão e o que deve ser colocado, independente do
serviço a ser agendado. Atualmente o requisito distingue entre dois tipos 'Dog
Walker' e 'Pet Sitting':
	> 3.1.4 \[RF 04] Agendamento de horários para Dog Walkers \n
	3.1.5 \[RF 05] Agendamento de horários para Pet Sitters

Depois fazer os requisitos separados para determinar as informações exclusivas
de um tipo de serviço.

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
- Alterações devem ser possíveis de serem feitas por qualquer utilizador

