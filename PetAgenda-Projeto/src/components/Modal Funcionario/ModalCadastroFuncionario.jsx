import styles from "./ModalCadastroFuncionario.module.css"


const ModalCadastroFuncionario = ({ isOpen, onClose, children }) => {

    if (!isOpen) return null;
    
    return(
        <div className={styles.modalContent}>
            <div className={styles.conteudoModal}>
                <div className={styles.containerFechar}>
                    <button onClick={onClose} className={styles.botaoFechar}>X</button>
                </div>
                
                <div className={styles.childrenConteudo}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ModalCadastroFuncionario