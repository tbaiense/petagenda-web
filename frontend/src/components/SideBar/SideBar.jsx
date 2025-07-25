import styles from "./SideBar.module.css";
import iconPerfil from "../../assets/icon_perfil.svg";
import { useAuth } from "../../contexts/UserContext";
import Modal from "react-bootstrap/Modal";
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

import { FaPeopleGroup } from "react-icons/fa6";

import { PiBuildingOfficeBold } from "react-icons/pi";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";

const SideBar = () => {
  const { removeEmpresa, removeToken } = useAuth();
    const [mostrarModalSaida, setmostrarModalSaida] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };
  const handleClose = () => setmostrarModalSaida(false);
  const handleConfirm = () => {
    removeEmpresa();
    removeToken();
    navigate("/login");
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
            onClick={() => {
              if(isOpen){
                toggleDropdown("agendamentos");
              }else{
                navigate("/empresa/agendamentos/lista")
              }
            }}
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
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/servicos/realizados/cadastrar">
                    Realizado
                  </Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Agendamentos</p>
                <li>
                  <Link to="/empresa/agendamentos/cadastrar" onClick={e => e.stopPropagation()}>Novo</Link>
                </li>
                <li>
                  <Link to="/empresa/agendamentos/lista">Lista</Link>
                </li>
                <li>
                  <Link to="/empresa/servicos/realizados/cadastrar" onClick={e => e.stopPropagation()}>
                    Realizado
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li
            className={`${styles.sideItem} ${styles.dropdownWrapper} ${styles.branco}`}
            onClick={isOpen ? () => toggleDropdown("pets") : () => navigate("/empresa/pets/lista")}
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
                  <Link to="/empresa/pets/cadastrar" onClick={e => e.stopPropagation()}>Cadastrar</Link>
                </li>
                <li>
                  <Link to="/empresa/pets/lista" onClick={e => e.stopPropagation()}>Lista</Link>
                </li>
              </ul>
            )}
          </li>

          <li
            className={`${styles.sideItem} ${styles.dropdownWrapper} ${styles.branco}`}
            onClick={isOpen ? () => toggleDropdown("clients") : () => navigate("/empresa/clientes/lista")}
          >
            <div
              className={
                isOpen ? styles.dropdownTrigger : styles.dropdownTrigge
              }
            >
              <FaUserFriends />
              <span className={styles.itemDescription}>Clientes</span>
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
                  <Link to="/empresa/clientes/cadastrar">Novo Cliente</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/clientes/lista">Lista de Clientes</Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Cliente</p>
                <li>
                  <Link to="/empresa/clientes/cadastrar" onClick={e => e.stopPropagation()}>Novo</Link>
                </li>
                <li>
                  <Link to="/empresa/clientes/lista" onClick={e => e.stopPropagation()}>Lista</Link>
                </li>
              </ul>
            )}
          </li>

          <li
            className={`${styles.sideItem}`}
          >
            <Link to="/empresa/funcionarios">
              <FaPeopleGroup  className={styles.branco} />
              <span className={styles.itemDescription}>Funcionários</span>
            </Link>
          </li>

          <li
            className={`${styles.sideItem} ${styles.dropdownWrapper} ${styles.branco}`}
            onClick={isOpen ? () => toggleDropdown("servicos") : () => navigate("/empresa/servicos/lista")}
          >
            <div
              className={
                isOpen ? styles.dropdownTrigger : styles.dropdownTrigge
              }
            >
              <FaClipboardList />
              <span className={styles.itemDescription}>Serviço oferecido</span>
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
                  <Link to="/empresa/servicos/cadastrar">Novo</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/empresa/servicos/lista">Lista</Link>
                </li>
              </ul>
            )}
            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <p className={styles.tituloDropdow}>Serviço oferecido</p>
                <li>
                  <Link to="/empresa/servicos/cadastrar" onClick={e => e.stopPropagation()}>Novo</Link>
                </li>
                <li>
                  <Link to="/empresa/servicos/lista">Lista</Link>
                </li>
              </ul>
            )}
          </li>

          {/* <li
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
          </li> */}
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
              <span className={styles.itemDescription}>Relatório</span>
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
                <p className={styles.tituloDropdow}>Relatório</p>
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
      <Modal show={mostrarModalSaida} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Tem certeza?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Ao sair você vai estar se desconectando da plataforma!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"

            onClick={handleConfirm}
          >
            Sair
          </Button>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        </Modal.Footer>
      </Modal>

      <div className={styles.logout}>
        <button
          onClick={() => setmostrarModalSaida(true)}
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
