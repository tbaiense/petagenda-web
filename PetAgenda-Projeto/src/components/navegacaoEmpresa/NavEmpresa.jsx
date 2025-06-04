import { Link } from "react-router-dom"
import styles from './NavEmpresa.module.css'


const NavEmpresa = () => {
    return(
        <div className={styles.navBarEmpresa}>
            {/* Não vamos usar o LINK para navergar entre as paginas, vamos usar o onClick para fazer verificação e depois navegar pelas páginas */}
            <button><Link to="/empresa/cadastrar">CADASTRO</Link></button>
            <button><Link to="/empresa/informacoes">EMPRESA</Link></button>
            <button><Link to="/empresa/planos">LICENÇA</Link></button>
            <button>ALTERAR DADOS</button>
        </div>
    )
} 
 
 
 
export default NavEmpresa