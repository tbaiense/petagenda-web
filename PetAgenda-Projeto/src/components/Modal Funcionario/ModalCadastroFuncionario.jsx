import styles from "./ModalCadastroFuncionario.module.css"


const ModalCadastroFuncionario = ({ isOpen, onClose, children }) => {

    if (!isOpen) return null;
    
    return(
        <div>
            <div className="modal-content">
                <button onClick={onClose}>Fechar</button>
                {children}
            </div>
        </div>
    )
}

export default ModalCadastroFuncionario