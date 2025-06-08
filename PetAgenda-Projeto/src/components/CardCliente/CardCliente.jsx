import styles from './CardCliente.module.css'

const CardCliente = (props) => {
    return(
        <div className={styles.cardFun}>
            <span>{props.nome}</span>
            <span>{props.telefone}</span>
        </div>
    )
}

export default CardCliente