import { Link } from "react-router-dom"
import styles from './NavEmpresa.module.css'


const NavEmpresa = () => {
    return(
        <div className={styles.navBarEmpresa}>
            {/* Não vamos usar o LINK para navergar entre as paginas, vamos usar o onClick para fazer verificação e depois navegar pelas páginas */}
            <button><Link to="/dashboard">CADASTRO</Link></button>
            <button><Link to="/dashboard/empresa">EMPRESA</Link></button>
            <button><Link to="/dashboard/Planos">LICENÇA</Link></button>
            <button>ALTERAR DADOS</button>
        </div>
    )
} 
 
 
 
export default NavEmpresa