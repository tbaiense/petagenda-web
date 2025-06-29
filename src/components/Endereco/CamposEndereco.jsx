import { useEffect, useState } from "react";
import { UFS } from "../../data/info";
import styles from "./CamposEndereco.module.css";

const CamposEndereco = ({ 
  cep, setCep, endereco, handleChange, 
  setValue,
  prefix, register, errors,
  formConfigs,
  estadoPadrao,
  isDisabled = false
}) => {
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

  const errorsObj = errors[prefix];
  const [ estadoSel, setEstadoSel ] = useState(0);
  return (
    <div className={styles.enderecoContainer}>
      <div className={styles.linhaEndereco}>
        {/* <div>{(formConfigs) ? (formConfigs.isRequired ? "true" : "false") : "true"}</div> */}
        <div className={`${styles.labelInput} ${styles.flex5}`}>
          <label>CEP</label>
          <input
            type="text"
            // value={cep ?? ''}
            defaultValue={endereco?.cep || ""}
            placeholder="12345678"
            disabled={isDisabled}
            onInput={(e) => {
              let value = e.target.value;

              if (value && value.length > 0) {
                value = value.replaceAll(/[^0-9]/g, '');
                value = value.substring(0, 8);
              }
              setValue(e.target.name, value);
              setCep(e.target.value);
            }}
            { ...register(`${prefix}.cep`,
              {
                required: false,
                pattern: {
                  value: /^\d{5,5}\d{3,3}$/,
                  message: "Formato esperado: 12345678 ou 12345-678 "
                }
              })
            }
          />
          {errorsObj?.cep && <p style={{ color: 'red' }}>{errorsObj?.cep.message}</p>}
        </div>
        <div className={`${styles.labelInput} ${styles.flex5}`}>
          <label>Logradouro</label>
          <input
            // value={endereco.logradouro ?? ''}
            // onInput={handleChange}
            defaultValue={endereco?.logradouro || ""}
            type="text"
            disabled={isDisabled}
            placeholder="Rua Feliz dos Palmares..."
            {...register(`${prefix}.logradouro`, { required: { value: (formConfigs) ? formConfigs.isRequired : true, message: "Logradouro é obrigatório" } })}
          />
          {errorsObj?.logradouro && <p style={{ color: 'red' }}>{errorsObj?.logradouro.message}</p>}
        </div>

        <div className={`${styles.labelInput} ${styles.flex1}`}>
          <label>Número</label>
          <input
            type="text"
            defaultValue={endereco?.numero || ""}
            // value={endereco.numero ?? ''}
            // onInput={handleChange}
            disabled={isDisabled}
            placeholder="Apto. 10, bloco 5..."
            {...register(`${prefix}.numero`, { required: { value: (formConfigs) ? formConfigs.isRequired : true, message: "Número é obrigatório" } })}
          />
          {errorsObj?.numero && <p style={{ color: 'red' }}>{errorsObj?.numero.message}</p>}
        </div>
      </div>
      <div className={styles.linhaEndereco}>
        <div className={`${styles.labelInput} ${styles.flex2}`}>
          <label>Bairro</label>
          <input
            type="text"
            defaultValue={endereco?.bairro || ""}
            // value={endereco.bairro ?? ''}
            // onInput={handleChange}
            disabled={isDisabled}
            placeholder="Bairro das Palmeiras"
            {...register(`${prefix}.bairro`, { required: { value: (formConfigs) ? formConfigs.isRequired : true, message: "Bairro é obrigatório" } })}
          />
          {errorsObj?.bairro && <p style={{ color: 'red' }}>{errorsObj?.bairro.message}</p>}
        </div>
        <div className={`${styles.labelInput} ${styles.flex3}`}>
          <label>Cidade</label>
          <input
            type="text"
            // value={endereco.cidade ?? ''}
            // onInput={handleChange}
            disabled={isDisabled}
            defaultValue={endereco?.cidade || ""}
            placeholder="Cidade do Futuro..."
            {...register(`${prefix}.cidade`, { required: { value: (formConfigs) ? formConfigs.isRequired : true, message: "Cidade é obrigatória" } })}
          />
          {errorsObj?.cidade && <p style={{ color: 'red' }}>{errorsObj?.cidade.message}</p>}
        </div>
        <div className={`${styles.labelInput} ${styles.flex1}`}>
          <label>UF</label>
          <select
            // value={endereco.uf ?? ''} 
            // onInput={handleChange}
            disabled={isDisabled}
            defaultValue={estadoPadrao}
            {...register(`${prefix}.estado`, 
            { required: { value: (formConfigs) ? formConfigs.isRequired : true, message: "Unidade Federativa é obrigatória" },
            })}>
            <option value="">UF</option>
            {UFS.map((uf, i) => (
              <option key={i} value={uf}>
                {uf}
              </option>
            ))}
          </select>
          {errorsObj?.estado && <p style={{ color: 'red' }}>{errorsObj?.estado.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default CamposEndereco;
