import styles from "./SideBar.module.css";
import iconPerfil from "../../assets/icon_perfil.svg";
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
import { Link } from "react-router-dom";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.openSidebar : ""}`}>
      <div className={styles.sidebar_content}>
        <div className={styles.user}>
          <img className={styles.user_avatar} src={iconPerfil} alt="Perfil" />
          <div className={styles.user_infos}>
            <span className={styles.itemDescription}>Fulano de Tal</span>
            <span className={styles.itemDescription}>Administrador</span>
          </div>
        </div>

        <ul className={styles.side_items}>
          <li className={styles.sideItem}>
            <Link to="/dashboard">
              <FaHome className={styles.branco} />
              <span className={styles.itemDescription}>Dashboard</span>
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
                  <Link to="/dashboard/agendamentos/novo">
                    Novo Agendamento
                  </Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/dashboard/agendamentos/lista">
                    Lista de Agendamentos
                  </Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Agendamento</p>
                <li>
                  <Link to="/dashboard/relatorios/mensal">Novo</Link>
                </li>
                <li>
                  <Link to="/dashboard/relatorios/anual">Lista</Link>
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
                  <Link to="/dashboard/pets/cadastrar">Cadastrar Pet</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/dashboard/pets/lista">Lista de Pets</Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Pet</p>
                <li>
                  <Link to="/dashboard/relatorios/mensal">Cadastrar</Link>
                </li>
                <li>
                  <Link to="/dashboard/relatorios/anual">Lista</Link>
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
                  <Link to="/dashboard/clients/novo">Novo Cliente</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/dashboard/clients/lista">Lista de Clientes</Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Cliente</p>
                <li>
                  <Link to="/dashboard/relatorios/mensal">Novo</Link>
                </li>
                <li>
                  <Link to="/dashboard/relatorios/anual">Lista</Link>
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
                  <Link to="/dashboard/funcionarios/novo">
                    Novo Funcionário
                  </Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/dashboard/funcionarios/lista">
                    Lista de Funcionários
                  </Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Funcionário</p>
                <li>
                  <Link to="/dashboard/relatorios/mensal">Novo</Link>
                </li>
                <li>
                  <Link to="/dashboard/relatorios/anual">Lista</Link>
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
                  <Link to="/dashboard/servicos/novo">Novo Serviço</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/dashboard/servicos/lista">Lista de Serviços</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/dashboard/servicos/novo">Serviço Realizado</Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Serviço</p>
                <li>
                  <Link to="/dashboard/relatorios/mensal">Novo</Link>
                </li>
                <li>
                  <Link to="/dashboard/relatorios/anual">Lista</Link>
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
                  <Link to="/dashboard/historico/mensal">Agendamentos</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/dashboard/historico/anual">Incidentes</Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Histórico</p>
                <li>
                  <Link to="/dashboard/relatorios/mensal">Agendamentos</Link>
                </li>
                <li>
                  <Link to="/dashboard/relatorios/anual">Incidentes</Link>
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
                  <Link to="/dashboard/relatorios/mensal">Simples</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/dashboard/relatorios/anual">Detalhado</Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Relatorio</p>
                <li>
                  <Link to="/dashboard/relatorios/mensal">Simples</Link>
                </li>
                <li>
                  <Link to="/dashboard/relatorios/anual">Detalhado</Link>
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
