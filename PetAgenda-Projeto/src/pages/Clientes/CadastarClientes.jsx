import styles from "./CadastrarClientes.module.css"
import { UFS } from "../../data/info"
import { useForm } from "react-hook-form"

const CadastarClientes = () => {

    const {
        register,
        handleSubmit,
        formState:{errors},
        reset,
        watch
    } = useForm();



  return (
    <div>
      <div>
        <h1>Cadastro de Cliente</h1>
        <hr />
      </div>


      <form action="">
        {/* Aqui é a área de nome e telefone */}
        <div>
          <label htmlFor="">Nome</label>
          <input type="text" />

          <label htmlFor="">Telefone</label>
          <input type="text" />
        </div>

        {/* Aqui é a área de endereço */}
        <div>
          <div className={styles.estiloTitulos}>
            <h3>Endereço</h3>
            <span>+</span>
          </div>
          <hr />

          <div>
            <label htmlFor="">Logradouro</label>
            <input type="text" />
          </div>

          <div>
            <label htmlFor="">Número</label>
            <input type="text" />
          </div>

          <div>
            <label htmlFor="">Bairro</label>
            <input type="text" />
          </div>

          <div>
            <label htmlFor="">Cidade</label>
            <input type="text" />
          </div>

          <select >
            <option value="">UF</option>
            {UFS.map((UF, index) => (
                <option key={index} value={UF}>{UF}</option>
            ))}
          </select>
    
        </div>
        
        {/* Aqui é a área de adicionar serviço requeridos */}
        <div>
            <div className={styles.estiloTitulos}>
              <h3>Serviços Requeridos</h3>
              <span>+</span>
            </div>
            <hr />
            <div>
              <label htmlFor="">Serviços</label>
              <select>
                <option value="">Selecione o serviço</option>
                
                {/* VAi FUNIONAR DEPOIS*/}
                
                {/* <select {...register("servico", { required: "Selecione um serviço" })}>

                    <option value="">Selecione um serviço</option>

                    {servicos.map((servico) => (
                        <option key={servico.id} value={servico.id}>{servico.nome}</option>
                    ))}

                </select> */}
              </select>
            </div>
        </div>

      </form>
      
        
    
    </div>
  )
}

export default CadastarClientes