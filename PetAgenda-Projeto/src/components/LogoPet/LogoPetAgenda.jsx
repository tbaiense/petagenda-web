import styles from "./LogoPetAgenda.module.css"
import PetAgenda from "../../assets/LogoNav.png";

const LogoPetAgenda = () => {
    return(
        <div className={styles.logoPet}>
            <img src={PetAgenda} alt="Logo do petagenda" />
        </div>
    )
}

export default LogoPetAgenda