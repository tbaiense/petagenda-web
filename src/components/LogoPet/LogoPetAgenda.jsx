import styles from "./LogoPetAgenda.module.css"
import PetAgenda from "../../assets/LogoNav.png";
import { useAuth } from "../../contexts/UserContext";

const LogoPetAgenda = () => {
    const { validar } = useAuth();

    return(
        <div className={styles.logoPet}>
            <img src={PetAgenda} alt="Logo do petagenda" />
            {(!validar) ? (<span style={{ paddingLeft: '1em'}}><strong>EM MODO DE DESENVOLVIMENTO: SEM VALIDAÇÃO DE CREDENCIAIS!</strong></span>) : undefined}
        </div>
    )
}

export default LogoPetAgenda