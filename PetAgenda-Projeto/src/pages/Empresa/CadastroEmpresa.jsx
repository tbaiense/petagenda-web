import LogoPetAgenda from "../../components/LogoPetAgenda"
import MenuDashBoard from "../../components/MenuDashboard"
import styles from "./CadastroEmpresa.module.css"


const CadastroEmpresa = () => {
    return(
        <div className={styles.tese}>
            <MenuDashBoard/>
            <div>
                <LogoPetAgenda/>
                <section>
                    <div>
                        teste
                    </div>
                </section>
            </div>
        </div>
    )
}

export default CadastroEmpresa