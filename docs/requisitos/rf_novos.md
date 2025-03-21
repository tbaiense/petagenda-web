 
# Especificação de Requisitos do Sistema
Versão: 0.2  
Data: 21 de março de 2025  
<hr>

## <center>Requisitos Funcionais (novos)</center>


### [RF nn] Console de gestão de instâncias
**Completar**: Gerenciamento de acesso dos empreendedores pelo Administrador, aprovar licenças, revogar licenças, remover contas de utilizadores e gerenciamento de cotas.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável

### [RF nn] Gestão do perfil do Administrador
**Completar**: Funcionalidade para gestão de dados do Administrador e troca de senha de acesso.

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
A solução permitirá ao operador realizar o cadastro dos clientes, informando nome completo, endereço, rua, número, bairro, cidade, telefone de contato e tipo de serviço requerido.

Prioridade:  ( )Essencial  (X)Importante  ( )Desejável
 

### [RF nn] Categorias de serviço
**Completar**: Descrição do uso na filtragem por serviços. Significado de PS, DW, Saúde, Transporte, Hospedagem, Creche, PetCare, etc.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável


### [RF nn] Adição de restrições à serviços
**Completar**: Descrição do uso na priorização da sugestão de serviços durante cadastro de um agendamento ou serviço realizado.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável


### [RF nn] Restrição de espécies para serviço
**Completar**: Só é exibido como disponível para agendamento se for compatível com a espécie do pet.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável


### [RF nn] Restrição de participantes
**Completar**: Uso na funcionalidade de verificação de disponibilidade do funcionário. Descrição da diferença entre serviço individual e coletivo (passeios). **Define se é permitido, ou não, adicionar vários pets participantes a um agendamento ou registro de serviço executado cadastrado manualmente. Coletivo = permite vários pets participantes. Individual = apenas um.**

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


### [RF nn] Cadastro de agendamento de serviços
**Completar**: Informações comuns a todos as categorias de agendamentos. Pode conter informações adicionais, a depender da categoria atribuída ao serviço selecionado.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável


### [RF nn] Visualização de agendamentos recorrentes.
Descrição do requisito.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável


### [RF nn] Cancelamento de agendamentos recorrentes
Descrição do requisito.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável


### [RF nn] Controle e atribuição do estado de disponibilidade de funcionário
**Completar**: Definido manualmente ou automaticamente, se a restrição de participantes do serviço em que o funcionário estiver atribuído for individual. Interpretá-lo como disponível fora dos períodos especificados.

Prioridade:  ( )Essencial  ( )Importante  ( )Desejável