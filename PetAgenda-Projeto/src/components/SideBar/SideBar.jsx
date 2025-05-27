import styles from "./SideBar.module.css";
import iconPerfil from "../../assets/icon_perfil.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const SideBar = () => {
  const navigate = useNavigate()
  const navFuncionario = () => {
    navigate("/dashboard/funcionarios")
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

        <button>Cadastrar Serviço</button>

        <button onClick={navFuncionario}>Funcionário</button>

        <button>Cliente</button>

        <button>Pet</button>

        <button>Agendamentos</button>

        <button>Relatórios</button>

        <button>Sair</button>

      </nav>
    </div>
  );
};

export default SideBar;