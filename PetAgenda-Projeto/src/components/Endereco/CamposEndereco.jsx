import { UFS } from "../../data/info";
import styles from "./CamposEndereco.module.css";

const CamposEndereco = ({ prefix, register, errors }) => {
  /* Thiago >>> Castro, modifiquei o componente para ficar um pouco mais fácil
                de usar quando tem apenas um endereço, como no caso do cadastro
                de cliente: o 'prefix' é definido fora do componente e ele apenas
                utiliza diretamente. Espero que não gere problemas... :P  
  */
  if (!prefix) {
    prefix = 'endereco';
  }

  return (
    <div className={styles.enderecoContainer}>
      <div className={styles.linhaEndereco}>
      <div className={`${styles.labelInput} ${styles.flex5}`}>
          <label>CEP</label>
          <input
            type="text"
            placeholder="12345-678"
            {...register(`${prefix}.cep`, 
              { required: true, 
                maxLength: {
                  value: 9, 
                  message: "CEP deve ter 9 caracteres"
                }, 
                minLength: {
                  value: 9, 
                  message: "CEP deve ter 9 caracteres"
                }, 
                pattern: { 
                  value: /^\d{5,5}-\d{3,3}$/, 
                  message: "Formato esperado: 12345-678" 
                }
              })
            }
          />
          {errors.endereco?.cep && <p style={{color: 'red'}}>{errors.endereco?.cep.message}</p>}
        </div>
        <div className={`${styles.labelInput} ${styles.flex5}`}>
          <label>Logradouro</label>
          <input
            type="text"
            placeholder="Digite o logradouro"
            {...register(`${prefix}.logradouro`, { required: "Logradouro é obrigatório" })}
          />
          {errors.endereco?.logradouro && <p style={{color: 'red'}}>{errors.endereco?.logradouro.message}</p>}
        </div>

        <div className={`${styles.labelInput} ${styles.flex1}`}>
          <label>Número</label>
          <input
            type="text"
            placeholder="Número"
            {...register(`${prefix}.numero`, { required: "Número é obrigatório" })}
          />
          {errors.endereco?.numero && <p style={{color: 'red'}}>{errors.endereco?.numero.message}</p>}
        </div>
      </div>
      <div className={styles.linhaEndereco}>
        <div className={`${styles.labelInput} ${styles.flex2}`}>
          <label>Bairro</label>
          <input
            type="text"
            placeholder="Digite o bairro"
            {...register(`${prefix}.bairro`, { required: "Bairro é obrigatório" })}
          />
          {errors.endereco?.bairro && <p style={{color: 'red'}}>{errors.endereco?.bairro.message}</p>}
        </div>
        <div className={`${styles.labelInput} ${styles.flex3}`}>
          <label>Cidade</label>
          <input
            type="text"
            placeholder="Digite a cidade"
            {...register(`${prefix}.cidade`, { required: "Cidade é obrigatória" })}
          />
          {errors.endereco?.cidade && <p style={{color: 'red'}}>{errors.endereco?.cidade.message}</p>}
        </div>
        <div className={`${styles.labelInput} ${styles.flex1}`}>
          <label>UF</label>
          <select {...register(`${prefix}.uf`, { required: "Unidade Federativa é obrigatória" })}>
            <option value="">UF</option>
            {UFS.map((uf, i) => (
              <option key={i} value={uf}>
                {uf}
              </option>
            ))}
          </select>
          {errors.endereco?.uf && <p style={{color: 'red'}}>{errors.endereco?.uf.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default CamposEndereco;
