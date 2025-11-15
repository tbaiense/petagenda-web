<h1 style="text-align: center">🐾PetAgenda🐾</h1>

![Landing Page](./.github/landing.png)

O PetAgenda é uma plataforma digital para agendamento e gestão no setor Petcare, voltada a profissionais autônomos e empresas. Ela oferece recursos como cadastro de clientes, agendamentos, controle de funcionários e relatórios, ajudando a organizar o trabalho e facilitar decisões, diante da falta de ferramentas específicas na área.

# 📄Descrição
O PetAgenda é um projeto de TCC desenvolvido após um ano e meio de estudos no SENAI de Vitória–ES, no curso de Desenvolvimento de Sistemas. A plataforma surgiu da análise do crescimento do mercado pet e da falta de ferramentas específicas para serviços como Dog Walking e Pet Sitting, sendo uma oportunidade para aplicar todas as habilidades adquiridas ao longo do curso.

# 🛠Tecnologias utilizadas
<p align="center">
  <!-- Frontend -->
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="40" alt="HTML" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40" alt="CSS" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" width="40" alt="Bootstrap" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" alt="JavaScript" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" alt="React" />

  <!-- Backend e Banco -->
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" width="40" alt="Node.js" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" width="40" alt="MySQL" />

  <!-- Design e DevOps -->
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" width="40" alt="Figma" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="40" alt="Docker" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" width="40" alt="NPM" />

  <!-- Ferramentas -->
  <img src="https://img.icons8.com/fluent/48/000000/visual-studio-code-2019.png" width="40" alt="VS Code Icon"/>
  <img src="https://icon.icepanel.io/Technology/svg/DBeaver.svg" width="40" alt="DBeaver Icon" />
 


</p>


# 📝 Passo a passo para inicializar o projeto

### 1. Instalar o Docker Engine e o Docker Compose

No Windows e macOS é recomendável usar o Docker Desktop.

Links do Docker Desktop:
- [Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- [macOS](https://docs.docker.com/desktop/setup/install/mac-install)
- [Distribuições Linux](https://docs.docker.com/desktop/setup/install/linux/)

### 2. Clonar o repositório

> Para clonar o repositório é necessário ter o [git](https://git-scm.com/) instalado.

Com o git instalado, abra um terminal (no Windows é o 'cmd' ou PowerShell) e digite:

```
git clone https://github.com/tbaiense/petagenda-web.git petagenda
```

depois:

```
cd petagenda
```

### 3. Gerenciando os serviços usando o docker compose

Para colocar os serviços em execução:

```
docker compose -f docker-compose.yaml up -d
```

Parando todos os serviços e removendo dados gerados:

```
docker compose -f docker-compose.yaml down --rmi local --volumes
```

### 4. Acessando 

No navegador de internet, acesse o link: http://localhost:8080/

# Imagens e demonstração

## Listagem de agendamentos
![Agendamentos](./.github/agendamento-listagem.png)

## Listagem de pets
![Pets](./.github/pets-listagem.png)

## Listagem de serviços oferecidos
![Serviços](./.github/servico-listagem.png)

## Cadastro de serviço oferecido
![Cadastro de serviço](./.github/servico-cadastro.png)

# </> Desenvolvedores
<table> 
  <tr> 
    <td align="center" width="200">
      <a href="https://github.com/tbaiense"> 
        <img src="https://avatars.githubusercontent.com/u/168869648?v=4" width="100px" alt="Thiago Baiense"/> 
        <br /> 
        <sub>
          <b>
            Thiago Baiense
          </b>
        </sub>
        <br /> 
        <em>
          Deselvolvedor
        </em>
        <br /> 
        <a href="https://github.com/tbaiense"> 
          <img src="https://img.shields.io/badge/GitHub-000?style=flat&logo=github&logoColor=white"/> 
        </a> 
      </a> 
    </td>
    <td align="center" width="200">
      <a href="https://github.com/Arescoderx"> 
        <img src="https://avatars.githubusercontent.com/u/171873857?v=4" width="100px" alt="Thiago Baiense"/> 
        <br /> 
        <sub>
          <b>
            Matheus Schmidt
          </b>
        </sub>
        <br /> 
        <em>
          Desenvolvedor
        </em>
        <br /> 
        <a href="https://github.com/Arescoderx"> 
          <img src="https://img.shields.io/badge/GitHub-000?style=flat&logo=github&logoColor=white"/> 
        </a> 
      </a> 
    </td> 
    <td align="center" width="200">
      <a href="https://github.com/CastroKaiser"> 
        <img src="https://avatars.githubusercontent.com/u/168910263?v=4" width="100px" alt="Thiago Baiense"/> 
        <br /> 
        <sub>
          <b>
            Castro Kaiser
          </b>
        </sub>
        <br /> 
        <em>
          Desenvolvedor
        </em>
        <br /> 
        <a href="https://github.com/CastroKaiser"> 
          <img src="https://img.shields.io/badge/GitHub-000?style=flat&logo=github&logoColor=white"/> 
        </a> 
      </a> 
    </td> 
    <td align="center" width="200">
      <a href="https://github.com/Koji-Kashin"> 
        <img src="https://avatars.githubusercontent.com/u/171873345?v=4" width="100px" alt="Thiago Baiense"/> 
        <br /> 
        <sub>
          <b>
            Daniel Rodrigues
          </b>
        </sub>
        <br /> 
        <em>
          Desenvolvedor
        </em>
        <br /> 
        <a href="https://github.com/Koji-Kashin"> 
          <img src="https://img.shields.io/badge/GitHub-000?style=flat&logo=github&logoColor=white"/> 
        </a> 
      </a> 
    </td> 
  </tr> 
</table>
