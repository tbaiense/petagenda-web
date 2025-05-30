import { UFS } from "../../data/info";
import styles from "./CamposEndereco.module.css";

const CamposEndereco = ({ index = null, register }) => {
  const prefix = index !== null ? `enderecosExtras.${index}` : "enderecoPrincipal";

  return (
    <div className={styles.enderecoContainer}>
      <div className={styles.linhaEndereco}>
        <div className={`${styles.labelInput} ${styles.flex5}`}>
          <label>Logradouro</label>
          <input
            type="text"
            placeholder="Digite o logradouro"
            {...register(`${prefix}.logradouro`, { required: true })}
          />
        </div>

        <div className={`${styles.labelInput} ${styles.flex1}`}>
          <label>Número</label>
          <input
            type="text"
            placeholder="Número"
            {...register(`${prefix}.numero`, { required: true })}
          />
        </div>

        <div className={`${styles.labelInput} ${styles.flex1}`}>
          <label>UF</label>
          <select {...register(`${prefix}.uf`, { required: true })}>
            <option value="">UF</option>
            {UFS.map((uf, i) => (
              <option key={i} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.linhaEndereco}>
        <div className={`${styles.labelInput} ${styles.flex2}`}>
          <label>Bairro</label>
          <input
            type="text"
            placeholder="Digite o bairro"
            {...register(`${prefix}.bairro`, { required: true })}
          />
        </div>

        <div className={`${styles.labelInput} ${styles.flex3}`}>
          <label>Cidade</label>
          <input
            type="text"
            placeholder="Digite a cidade"
            {...register(`${prefix}.cidade`, { required: true })}
          />
        </div>
      </div>
    </div>
  );
};

export default CamposEndereco;
