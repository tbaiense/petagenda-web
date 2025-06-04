import SideBar from "./components/SideBar/SideBar"
import LogoPetAgenda from "./components/LogoPet/LogoPetAgenda"
import { Outlet } from "react-router-dom"
import styles from "./styles/MenuDashboard.module.css"
import { Link } from "react-router-dom";


const MenuDashBoard = () => {

    const verificaCadastroEmpresa = () => {
        alert("teste")
        
    }
    const verifica = () => {
        alert("Ainda em desenvolvimento")
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