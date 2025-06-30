import styles from './CardFuncionario.module.css'


const CardFuncionario = (props) => {
    return(
        <div className={styles.cardFun}>
            <span>{props.nome}</span>
            <span>{props.telefone}</span>
            <span>{props.servico}</span>
            <span>{props.sexo}</span>
        </div>
    )
}

export default CardFuncionario