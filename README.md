# 🐾PetAgenda🐾
O PetAgenda é uma plataforma digital para agendamento e gestão no setor Petcare, voltada a profissionais autônomos e empresas. Ela oferece recursos como cadastro de clientes, agendamentos, controle de funcionários e relatórios, ajudando a organizar o trabalho e facilitar decisões, diante da falta de ferramentas específicas na área.

# 📄Descrição
O PetAgenda é um projeto de TCC desenvolvido após um ano e meio de estudos no SENAI de Vitória–ES, no curso de Desenvolvimento de Sistemas. A plataforma surgiu da análise do crescimento do mercado pet e da falta de ferramentas específicas para serviços como Dog Walking e Pet Sitting, sendo uma oportunidade para aplicar todas as habilidades adquiridas ao longo do curso.

# 🛠Tecnologias utilizadas
<p align="left">
  <!-- Frontend -->
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="40" alt="HTML" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="40" alt="CSS" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" height="40" alt="Bootstrap" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="JavaScript" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="React" />

  <!-- Backend e Banco -->
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" height="40" alt="Node.js" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" height="40" alt="MySQL" />

  <!-- Design e DevOps -->
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" height="40" alt="Figma" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" height="40" alt="Docker" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" height="40" alt="NPM" />

  <!-- Ferramentas -->
  <img src="https://img.icons8.com/fluent/48/000000/visual-studio-code-2019.png" width="40" alt="VS Code Icon"/>
  <img src="https://icon.icepanel.io/Technology/svg/DBeaver.svg" width="40" alt="DBeaver Icon" />
 


</p>


# 📝 Passo a passo para inicializar o projeto
Frontend<br>
● cd frontend/ <br>
● npm install (para instalar todas as depêndencias) <br>
● npm start (para inicializar a aplicação) <br>

Backend<br>
● cd backend/ <br>
● npm install (para instalar todas as depêndencias) <br>
● npx prisma generate (para gerar a tipagem do banco de dados no código fonte por meio do PrismaORM) <br>
● npm run dev (para inicializar a aplicação) <br>

# 📖 Regras de negócio 
O sistema possui três tipos de perfis: <b>administradores</b>, <b>empresa</b> e <b>tutor de pet</b>. <br>
As <b>empresas</b> precisam cadastrar os serviços e produtos (e suas marcas e modelos) que ela trabalha, cadastrar as informações de perfil profissional e ainda realizar o pagamento do plano no site para poder ser divulgado para os usuários do perfil tutores de pet. <br>
Os <b>tutores de pet</b> fazem a busca pelos produtos ou serviços desejados, onde irá aparecer uma lista de empresas que trabalham com o item de busca, e clicando na empresa aparece suas informações de endereço, contato e dias de funcionamento. <br> 
Os <b>administradores</b> ficam responsáveis por toda a gestão de itens no sistema, como serviços, produtos, marcas e modelos.<br>

Os itens a serem divulgados estão em duas categorias, serviços e produtos, sendo que produtos são separados em subcategorias. Inicialmente, temos os produtos exemplos: ração, cosméticos, medicamentos, brinquedos. Depois temos as marcas de um produto, como uma marca de ração, de exemplo temos a marca: Pedigree. E por fim, temos modelos de uma marca, como exemplo da marca Pedigree temos os modelos: Cães Adultos de Porte Pequeno e Mini Sabor Carne e Vegetais, Nutrição Essencial Carne para Cães Adultos.

Ordem <br>
● Serviços<br>
● Produtos>Marcas>Modelos<br>

Sobre o que diz respeito ao cadastro dos usuários, os de perfil <b>empresa</b> e <b>tutor de pet</b> podem se cadastrar pelo próprio login do sistema, já os de perfil administrador só podem ser cadastrado por outro usuário administrador dentro do sistema, então por padrão no banco já vem cadastrado um usuário administrador:

● Login: jpetsADM@gmail.com<br>
● Senha: @Senha123<br>

O sistema possui a funcionalidade de fazer o <b>pagamento do plano</b> oferecido para as empresas para serem divulgados no sistema, para simularmos a transação de cartões nos colocamos valores fixos no banco de dados para servir como dados validos, abaixo estão os 3 cartões registrados com as seguintes informações: numero da conta, nome do cartão, data de vencimento, valor em banco. Lembrando que o valor sempre é descontado do valor original quando feito o pagamento do plano.

●("5162924598813451","joão felipe silva","03/24","265",1234.56)<br>
●("4108634623561342","matheus costa","03/24","265",12.56)<br>
●("4392672037645123","marcelo ferreira","03/24","265",260.00)<br>

# 🎲 Banco de dados

O sql do banco de dados se encontra no próprio projeto em um arquivo "SQL-J-pets.sql"

# </> Desenvolvedores
<a href="https://github.com/paulogmedeiros">Paulo Gabriel</a> e <a href="https://github.com/galazzij">Jamille Galazi</a>
