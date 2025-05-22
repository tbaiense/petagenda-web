import SideBar from "./components/SideBar/SideBar"
import LogoPetAgenda from "./components/LogoPet/LogoPetAgenda"
import { Outlet } from "react-router-dom"
import styles from "./styles/MenuDashBoard.module.css"
import { AuthProvider } from "./contexts/UserContext.jsx";
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
            <AuthProvider>
                <div className={styles.layoutDashboard}>
                    <SideBar/>
                    <div>
                        <LogoPetAgenda/>
                        <div className={styles.navBarEmpresa}>
                                {/* Não vamos usar o LINK para navergar entre as paginas, vamos usar o onClick para fazer verificação e depois navegar pelas páginas */}
                                <button><Link to="/dashboard">CADASTRO</Link></button>
                                <button><Link to="/dashboard/empresa">EMPRESA</Link></button>
                                <button><Link to="/dashboard/Planos">LICENÇA</Link></button>
                                <button onClick={verifica}>ALTERAR DADOS</button>
                        </div>

                        <div className={styles.layoutConteudo}>
                            <Outlet/>
                        </div>
                    </div>
                </div>
            </AuthProvider>  
        </>
    )
}

export default MenuDashBoard