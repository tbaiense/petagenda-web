import SideBar from "./components/SideBar/SideBar"
import LogoPetAgenda from "./components/LogoPet/LogoPetAgenda"
import { Outlet } from "react-router-dom"
import styles from "./styles/MenuDashboard.module.css"
import { useAuth } from "./contexts/UserContext";

const MenuDashBoard = () => {
    const { removeToken, setUsuario, setEmpresa, validar } = useAuth();
    if (!validar) {
        console.log('EM MODO DE DESENVOLVIMENTO: SEM VALIDAÇÃO DE CREDENCIAIS!')
        removeToken();
        setUsuario({id: 0, admin: false});
        setEmpresa({id: 0, licenca: 'corporativo'});
    }

    return(
        <>
            <div className={styles.layoutDashboard}>
                <SideBar/>
                <div>
                    <LogoPetAgenda/>
                    <div className={styles.navBarEmpresa}>
                        <Outlet/>
                    </div>
                </div>
            </div> 
        </>
    )
}

export default MenuDashBoard