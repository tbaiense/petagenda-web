import styles from "./SideBar.module.css";
import iconPerfil from "../../assets/icon_perfil.svg";
import {
  FaHome,
  FaUserFriends,
  FaClipboardList,
  FaDog,
  FaUsers,
  FaChartBar,
  FaChevronRight,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.openSidebar : ""}`}>
      <div className={styles.sidebar_content}>
        {/* Usuário */}
        <div className={styles.user}>
          <img className={styles.user_avatar} src={iconPerfil} alt="Perfil" />
          <div className={styles.user_infos}>
            <span className={styles.itemDescription}>Fulano de Tal</span>
            <span className={styles.itemDescription}>Administrador</span>
          </div>
        </div>

        {/* Menu */}
        <ul className={styles.side_items}>
          <li className={styles.sideItem}>
            <Link to="/dashboard">
              <FaHome />
              <span className={styles.itemDescription}>Dashboard</span>
            </Link>
          </li>

          {/* Outros itens... */}
          <li className={styles.sideItem}>
            <Link to="/dashboard/funcionarios">
              <FaUserFriends />
              <span className={styles.itemDescription}>Funcionários</span>
            </Link>
          </li>

          <li
            className={`${styles.sideItem} ${styles.dropdownWrapper}`}
            onClick={isOpen ? toggleDropdown : undefined}
          >
            <div className={styles.dropdownTrigger}>
              <FaChartBar />
              <span className={styles.itemDescription}>Relatórios</span>
              {isOpen && (
                <FaChevronDown
                  className={isDropdownOpen ? styles.rotateIconDown : ""}
                />
              )}
            </div>
            {isOpen && isDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                <li className={styles.dropdownItem}>
                  <Link to="/dashboard/relatorios/mensal">
                    <span className={styles.itemDescription}>Mensal</span>
                  </Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/dashboard/relatorios/anual">
                    <span className={styles.itemDescription}>Anual</span>
                  </Link>
                </li>
              </ul>
            )}

            {!isOpen && (
              <ul className={styles.floatingDropdown}>
                <li>
                  <Link to="/dashboard/relatorios/mensal">Mensal</Link>
                </li>
                <li>
                  <Link to="/dashboard/relatorios/anual">Anual</Link>
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
        <button className={`${styles.sideItem} ${styles.logout_btn}`}>
          <FaSignOutAlt />
          <span className={styles.itemDescription}>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default SideBar;
