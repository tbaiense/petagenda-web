# Especificação de Requisitos do Sistema
Versão: 0.3  
Data: 22 de março de 2025
<hr>  

## Requisitos Não funcionais (novos)

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