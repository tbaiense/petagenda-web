import styles from "./MenuDashboard.module.css";
import iconPerfil from "../../assets/icon_perfil.svg";
import { Link } from "react-router-dom";
import PetAgenda from "../../assets/LogoNav.png"

const MenuDashBoard = () => {
  return (
    <div className={styles.sideBar}>
      <div className={styles.logo}>
          <Link to="/perfilempresa">
              <img src={iconPerfil} alt="Ícone do Perfil" />
              <p>Nome da Empresa</p>
          </Link>
      </div>

      <nav className={styles.navegacao}>
        <button>Início</button>

        <button>Cadastrar Serviço</button>

        <button>Funcionário</button>

        <button>Cliente</button>

        <button>Pet</button>

        <button>Agendamentos</button>

        <button>Relatórios</button>

        <button>Sair</button>

      </nav>
    </div>
  );
};

export default MenuDashBoard;