import styles from "./SideBar.module.css";
import iconPerfil from "../../assets/icon_perfil.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const SideBar = () => {
  const navigate = useNavigate()



  const navFuncionario = () => {
    navigate("/dashboard/funcionarios")
  }

  const navServico = () => {
    navigate("/dashboard/servicos")
  }

 const navCliente = () => {
    navigate("/dashboard/clientes")
 }

 const navPet = () =>{
    navigate("/dashboard/pets")
 }

 const navAgendamentos = () => {
    navigate("/dashboard/agendamentos")
 }
 const navRelatorios = () => {
    navigate("/dashboard/relatorios")
 }

  return (
    <div className={styles.sideBar}>
      <div className={styles.logo}>
          <Link to="/dashboard">
              <img src={iconPerfil} alt="Ícone do Perfil" />
              <p>Nome da Empresa</p>
          </Link>
      </div>

      <nav className={styles.navegacao}>
        <button>Início</button>

        <button onClick={navServico}>Cadastrar Serviço</button>

        <button onClick={navFuncionario}>Funcionário</button>

        <button onClick={navCliente}>Cliente</button>

        <button onClick={navPet}>Pet</button>

        <button onClick={navAgendamentos}>Agendamentos</button>

        <button onClick={navRelatorios}>Relatórios</button>

        <button>Sair</button>

      </nav>
    </div>
  );
};

export default SideBar;