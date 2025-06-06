import styles from "./ModalCadastroFuncionario.module.css"


const ModalCadastroFuncionario = ({ isOpen, onClose, children }) => {

    if (!isOpen) return null;
    
    return(
        <div className={styles.beforeModal}>
            <div className={styles.cardModal}>

                <div className={styles.posicaoBotao}>
                    <button onClick={onClose} className={styles.botaoFechar}>X</button>
                </div>
                
                <div className={styles.onlyTitle}>
                    {children}
                </div>

            </div>
        </div>
    )
}

export default ModalCadastroFuncionario