import { UFS } from "../../data/info"
import styles from "./CamposEndereco.module.css"

const CamposEndereco = ({index, register}) => {
    console.log("Renderizando endereço", index);
    return(
<div className={styles.enderecoContainer}>

  <div className={styles.linhaEndereco}>
    <div className={`${styles.labelInput} ${styles.flex5}`}>
      <label>Logradouro</label>
      <input type="text" placeholder="Digite o logradouro" />
    </div>

    <div className={`${styles.labelInput} ${styles.flex1}`}>
      <label>Número</label>
      <input type="text" placeholder="Número" />
    </div>

    <div className={`${styles.labelInput} ${styles.flex1}`}>
      <label>UF</label>
      <select>
        <option value="">UF</option>
        {UFS.map((uf, index) => (
          <option key={index} value={uf}>{uf}</option>
        ))}
      </select>
    </div>
  </div>

  <div className={styles.linhaEndereco}>
    <div className={`${styles.labelInput} ${styles.flex2}`}>
      <label>Bairro</label>
      <input type="text" placeholder="Digite o bairro" />
    </div>

    <div className={`${styles.labelInput} ${styles.flex3}`}>
      <label>Cidade</label>
      <input type="text" placeholder="Digite a cidade" />
    </div>
  </div>

</div>

    )
}

export default CamposEndereco