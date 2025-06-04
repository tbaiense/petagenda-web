import ftTemp from "../../../assets/LogoNav.png";
import NavEmpresa from "../../../components/navegacaoEmpresa/NavEmpresa.jsx";

const ViewEmpresa = () => {
  // Faço a conexão com o banco

  // Pego os Dados da empresa baseado no plano adquirido e no ID

  // Converto os Dados em JSON

  // Uso o Map para gerar as informações dentro de cada campo

  return (
    <div>
      <NavEmpresa />
      <div>
        <img src={ftTemp} alt="Foto_da_sua_empresa" />
        <div>
          <h2>Nome da Empresa</h2>
          <hr />
          <h4>Razão Social | CNPJ</h4>
          <p>Lema</p>
        </div>
      </div>

      <div>
        <div>
          <h4>Funcionarios</h4>
          <p>Nenhum Funcionario</p>
        </div>

        <div>
          <h4>Serviços Oferecidos</h4>
          <p>Nenhum Serviço Oferecido</p>
        </div>
      </div>
    </div>
  );
};

export default ViewEmpresa;
