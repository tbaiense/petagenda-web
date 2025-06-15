import styles from "./SideBar.module.css";
import iconPerfil from "../../assets/icon_perfil.svg";
import { useAuth } from "../../contexts/UserContext";
import {
  FaHome,
  FaUserFriends,
  FaClipboardList,
  FaDog,
  FaCalendar,
  FaHistory,
  FaUsers,
  FaChartBar,
  FaChevronRight,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";
import { PiBuildingOfficeBold } from "react-icons/pi";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SideBar = () => {
  const { removeEmpresa, removeToken} = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.openSidebar : ""}`}>
      <div className={styles.sidebar_content}>
        <Link to="/empresa/informacoes" className={styles.user}>
          <img className={styles.user_avatar} src={iconPerfil} alt="Perfil" />
          <div className={styles.user_infos}>
            <span className={styles.itemDescription}>Fulano de Tal</span>
            <span className={styles.itemDescription}>Administrador</span>
          </div>
        </Link>

        <ul className={styles.side_items}>
          <li className={styles.sideItem}>
            <Link to="dashboard">
              <FaHome className={styles.branco} />
              <span className={styles.itemDescription}>Home</span>
            </Link>
          </li>

          <li
            className={`${styles.sideItem} ${styles.dropdownWrapper} ${styles.branco}`}
            onClick={isOpen ? () => toggleDropdown("agendamentos") : undefined}
          >
            <div
              className={
                isOpen ? styles.dropdownTrigger : styles.dropdownTrigge
              }
            >
              <FaCalendar />
              <span className={styles.itemDescription}>Agendamentos</span>
              {isOpen && (
                <FaChevronDown
                  className={
                    (openDropdown === "agendamentos"
                      ? styles.rotateIconDown
                      : "",
                    styles.branco)
                  }
                />
              )}
            </div>
            {isOpen && openDropdown === "agendamentos" && (
              <ul className={styles.dropdownMenu}>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/agendamentos/cadastrar">
                    Novo Agendamento
                  </Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/agendamentos/lista">
                    Lista de Agendamentos
                  </Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Agendamento</p>
                <li>
                  <Link to="/empresa/agendamentos/cadastrar">Novo</Link>
                </li>
                <li>
                  <Link to="/empresa/agendamentos/lista">Lista</Link>
                </li>
              </ul>
            )}
          </li>

          <li
            className={`${styles.sideItem} ${styles.dropdownWrapper} ${styles.branco}`}
            onClick={isOpen ? () => toggleDropdown("pets") : undefined}
          >
            <div
              className={
                isOpen ? styles.dropdownTrigger : styles.dropdownTrigge
              }
            >
              <FaDog />
              <span className={styles.itemDescription}>Pets</span>
              {isOpen && (
                <FaChevronDown
                  className={
                    openDropdown === "pets" ? styles.rotateIconDown : ""
                  }
                />
              )}
            </div>
            {isOpen && openDropdown === "pets" && (
              <ul className={styles.dropdownMenu}>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/pets/cadastrar">Cadastrar Pet</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/pets/lista">Lista de Pets</Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Pet</p>
                <li>
                  <Link to="/empresa/pets/cadastrar">Cadastrar</Link>
                </li>
                <li>
                  <Link to="/empresa/pets/lista">Lista</Link>
                </li>
              </ul>
            )}
          </li>

          <li
            className={`${styles.sideItem} ${styles.dropdownWrapper} ${styles.branco}`}
            onClick={isOpen ? () => toggleDropdown("clients") : undefined}
          >
            <div
              className={
                isOpen ? styles.dropdownTrigger : styles.dropdownTrigge
              }
            >
              <FaUserFriends />
              <span className={styles.itemDescription}>Clients</span>
              {isOpen && (
                <FaChevronDown
                  className={
                    openDropdown === "clients" ? styles.rotateIconDown : ""
                  }
                />
              )}
            </div>
            {isOpen && openDropdown === "clients" && (
              <ul className={styles.dropdownMenu}>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/clients/cadastrar">Novo Cliente</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/clients/lista">Lista de Clientes</Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Cliente</p>
                <li>
                  <Link to="/empresa/clientes/cadastrar">Novo</Link>
                </li>
                <li>
                  <Link to="/empresa/clientes/lista">Lista</Link>
                </li>
              </ul>
            )}
          </li>

          <li
            className={`${styles.sideItem} ${styles.dropdownWrapper} ${styles.branco}`}
            onClick={isOpen ? () => toggleDropdown("funcionarios") : undefined}
          >
            <div
              className={
                isOpen ? styles.dropdownTrigger : styles.dropdownTrigge
              }
            >
              <PiBuildingOfficeBold />
              <span className={styles.itemDescription}>Funcionários</span>
              {isOpen && (
                <FaChevronDown
                  className={
                    openDropdown === "funcionarios" ? styles.rotateIconDown : ""
                  }
                />
              )}
            </div>
            {isOpen && openDropdown === "funcionarios" && (
              <ul className={styles.dropdownMenu}>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/funcionarios">
                    Novo Funcionario
                  </Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Funcionário</p>
                <li>
                  <Link to="/empresa/funcionarios">Novo</Link>
                </li>
              </ul>
            )}
          </li>

          <li
            className={`${styles.sideItem} ${styles.dropdownWrapper} ${styles.branco}`}
            onClick={isOpen ? () => toggleDropdown("servicos") : undefined}
          >
            <div
              className={
                isOpen ? styles.dropdownTrigger : styles.dropdownTrigge
              }
            >
              <FaClipboardList />
              <span className={styles.itemDescription}>Serviços</span>
              {isOpen && (
                <FaChevronDown
                  className={
                    openDropdown === "servicos" ? styles.rotateIconDown : ""
                  }
                />
              )}
            </div>
            {isOpen && openDropdown === "servicos" && (
              <ul className={styles.dropdownMenu}>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/servicos/cadastrar">Novo Serviço</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/servicos/lista">Lista de Serviços</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/servicos/realizados">Serviço Realizado</Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Serviço</p>
                <li>
                  <Link to="/empresa/servicos/cadastrar">Novo</Link>
                </li>
                <li>
                  <Link to="/empresa/servicos/lista">Lista</Link>
                </li>
                <li>
                  <Link to="/empresa/servicos/realizados">Realizado</Link>
                </li>
              </ul>
            )}
          </li>

          <li
            className={`${styles.sideItem} ${styles.dropdownWrapper} ${styles.branco}`}
            onClick={isOpen ? () => toggleDropdown("historico") : undefined}
          >
            <div
              className={
                isOpen ? styles.dropdownTrigger : styles.dropdownTrigge
              }
            >
              <FaHistory />
              <span className={styles.itemDescription}>Histórico</span>
              {isOpen && (
                <FaChevronDown
                  className={
                    openDropdown === "historico" ? styles.rotateIconDown : ""
                  }
                />
              )}
            </div>
            {isOpen && openDropdown === "historico" && (
              <ul className={styles.dropdownMenu}>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/historico/mensal">Agendamentos</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/historico/anual">Incidentes</Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Histórico</p>
                <li>
                  <Link to="/empresa/historico/agendamentos">Agendamentos</Link>
                </li>
                <li>
                  <Link to="/empresa/relatorios/incidentes">Incidentes</Link>
                </li>
              </ul>
            )}
          </li>
          <li
            className={`${styles.sideItem} ${styles.dropdownWrapper} ${styles.branco}`}
            onClick={isOpen ? () => toggleDropdown("relatorio") : undefined}
          >
            <div
              className={
                isOpen ? styles.dropdownTrigger : styles.dropdownTrigge
              }
            >
              <FaChartBar />
              <span className={styles.itemDescription}>Relatorio</span>
              {isOpen && (
                <FaChevronDown
                  className={
                    openDropdown === "relatorio" ? styles.rotateIconDown : ""
                  }
                />
              )}
            </div>
            {isOpen && openDropdown === "relatorio" && (
              <ul className={styles.dropdownMenu}>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/relatorios/gastos">Gastos</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/relatorios/detalhado">Detalhado</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/relatorios/simples">Simples</Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Relatorio</p>
                <li>
                  <Link to="/empresa/relatorios/simples">Simples</Link>
                </li>
                <li>
                  <Link to="/empresa/relatorios/detalhado">Detalhado</Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        <button className={styles.open_btn} onClick={toggleSidebar}>
          <FaChevronRight
            className={`${styles.open_btn_icon} ${
              isOpen ? styles.rotateIcon : ""
            }`}
          />
        </button>
      </div>

      <div className={styles.logout}>
        <button
          onClick={ e => {
            if (confirm("Deseja realmente sair da conta atual?")) {
              navigate("/login");
              removeEmpresa();
              removeToken();
            }
          }}
          className={`${styles.sideItem} ${
            isOpen ? styles.logout_btn : styles.logout_btn_close
          }`}
        >
          <FaSignOutAlt />
          <span className={styles.itemDescription}>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default SideBar;

// <li
//   className={`${styles.sideItem} ${styles.dropdownWrapper}`}
//   onClick={isOpen ? toggleDropdown : undefined}
// >
//   <div className={styles.dropdownTrigger}>
//     <FaCalendar />
//     <span className={styles.itemDescription}>Relatórios</span>
//     {isOpen && (
//       <FaChevronDown
//         className={isDropdownOpen ? styles.rotateIconDown : ""}
//       />
//     )}
//   </div>
//   {isOpen && isDropdownOpen && (
//     <ul className={styles.dropdownMenu}>
//       <li className={styles.dropdownItem}>
//         <Link to="/dashboard/relatorios/mensal">
//           <span className={styles.itemDescription}>Novo Agendamento</span>
//         </Link>
//       </li>
//       <li className={styles.dropdownItem}>
//         <Link to="/dashboard/relatorios/anual">
//           <span className={styles.itemDescription}>Agendamentos</span>
//         </Link>
//       </li>
//       <li className={styles.dropdownItem}>
//         <Link to="/dashboard/relatorios/anual">
//           <span className={styles.itemDescription}>Pacote de</span>
//         </Link>
//       </li>
//     </ul>
//   )}

//   {!isOpen && (
//     <ul className={styles.floatingDropdown}>
//       <li>
//         <Link to="/dashboard/relatorios/mensal">Simples</Link>
//       </li>
//       <li>
//         <Link to="/dashboard/relatorios/anual">Detalhado</Link>
//       </li>
//     </ul>
//   )}
// </li>
