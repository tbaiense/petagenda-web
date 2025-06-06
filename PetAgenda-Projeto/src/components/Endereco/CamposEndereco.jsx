import { UFS } from "../../data/info";
import styles from "./CamposEndereco.module.css";

const CamposEndereco = ({ 
  // cep, setCep, endereco, handleChange, 
  setValue,
  prefix, register, errors }) => {
  /* Thiago >>> Castro, modifiquei o componente para ficar um pouco mais fácil
                de usar quando tem apenas um endereço, como no caso do cadastro
                de cliente: o 'prefix' é definido fora do componente e ele apenas
                utiliza diretamente. Espero que não gere problemas... :P  
  */
  if (!prefix) {
    prefix = 'endereco';
  }

  // if (!endereco) {
  //   endereco = {
  //     cep: "",
  //     logradouro: "",
  //     numero: "",
  //     bairro: "",
  //     cidade: "",
  //     uf: ""
  //   };
  // }

  return (
    <div className={styles.enderecoContainer}>
      <div className={styles.linhaEndereco}>
        <div className={`${styles.labelInput} ${styles.flex5}`}>
          <label>CEP</label>
          <input
            type="text"
            // value={cep ?? ''}
            placeholder="12345678"
            {...register(`${prefix}.cep`,
              {
                required: true,
                onChange: (e) => {
                  let value = e.target.value;

                  if (value && value.length > 0) {
                    value = value.replaceAll(/[^0-9]/g, '');
                  }
                  setValue(e.target.name, value);
                },
                pattern: {
                  value: /^\d{5,5}\d{3,3}$/,
                  message: "Formato esperado: 12345678 ou 12345-678 "
                }
              })
            }
          />
          {errors.endereco?.cep && <p style={{ color: 'red' }}>{errors.endereco?.cep.message}</p>}
        </div>
        <div className={`${styles.labelInput} ${styles.flex5}`}>
          <label>Logradouro</label>
          <input
            // value={endereco.logradouro ?? ''}
            // onInput={handleChange}
            type="text"
            placeholder="Rua Feliz dos Palmares..."
            {...register(`${prefix}.logradouro`, { required: { value: true, message: "Logradouro é obrigatório" } })}
          />
          {errors.endereco?.logradouro && <p style={{ color: 'red' }}>{errors.endereco?.logradouro.message}</p>}
        </div>

        <div className={`${styles.labelInput} ${styles.flex1}`}>
          <label>Número</label>
          <input
            type="text"
            // value={endereco.numero ?? ''}
            // onInput={handleChange}
            placeholder="Apto. 10, bloco 5..."
            {...register(`${prefix}.numero`, { required: { value: true, message: "Número é obrigatório" } })}
          />
          {errors.endereco?.numero && <p style={{ color: 'red' }}>{errors.endereco?.numero.message}</p>}
        </div>
      </div>
      <div className={styles.linhaEndereco}>
        <div className={`${styles.labelInput} ${styles.flex2}`}>
          <label>Bairro</label>
          <input
            type="text"
            // value={endereco.bairro ?? ''}
            // onInput={handleChange}
            placeholder="Bairro das Palmeiras"
            {...register(`${prefix}.bairro`, { required: { value: true, message: "Bairro é obrigatório" } })}
          />
          {errors.endereco?.bairro && <p style={{ color: 'red' }}>{errors.endereco?.bairro.message}</p>}
        </div>
        <div className={`${styles.labelInput} ${styles.flex3}`}>
          <label>Cidade</label>
          <input
            type="text"
            // value={endereco.cidade ?? ''}
            // onInput={handleChange}
            placeholder="Cidade do Futuro..."
            {...register(`${prefix}.cidade`, { required: { value: true, message: "Cidade é obrigatória" } })}
          />
          {errors.endereco?.cidade && <p style={{ color: 'red' }}>{errors.endereco?.cidade.message}</p>}
        </div>
        <div className={`${styles.labelInput} ${styles.flex1}`}>
          <label>UF</label>
          <select
            // value={endereco.uf ?? ''} 
            // onInput={handleChange}
            {...register(`${prefix}.estado`, { required: { value: true, message: "Unidade Federativa é obrigatória" } })}>
            <option value="">UF</option>
            {UFS.map((uf, i) => (
              <option key={i} value={uf}>
                {uf}
              </option>
            ))}
          </select>
          {errors.endereco?.estado && <p style={{ color: 'red' }}>{errors.endereco?.estado.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default CamposEndereco;
