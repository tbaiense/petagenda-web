import styles from "./Cadastrar_Clientes.module.css"
import { useForm } from "react-hook-form"
import { useEffect,useState } from "react";
import { clientes } from "../../data/testeDeTabela";
import { useAuth } from '../../contexts/UserContext';
import CamposEndereco from "../../components/Endereco/CamposEndereco";
import { useNavigate } from "react-router-dom";

const CadastrarClientes = () => {
  const { empresaFetch } = useAuth();
  const [servicos, setServicos] = useState([]);
  const navigate = useNavigate()
  const [servicosSelecionados, setServicosSelecionados] = useState([]);

  const {
    register,
    handleSubmit,
    formState:{errors},
    subscribe,
    reset,
    watch
} = useForm();

  // Verificação de CEP
  useEffect(() => {
    const callback = subscribe({
      name: [ "endereco.cep" ],
      formState: {
        values: true,
        touchedFields: true,
        isValid: true
      },
      callback: ({values}) => {
        if (values.endereco && values.endereco.cep?.length == 9) {
          const { cep } = values.endereco;
          console.log('cep: ', cep);
        }
      }
    });

    return () => callback();

  }, [subscribe]);

  // Pego os funcionarios do banco da empresa
  useEffect(() => {
    empresaFetch('/servico-oferecido')
    .then(res => res.json())
    .then(data => {
        setServicos(data.servicosOferecidos);
    })
    .catch(error => {
        console.error("Erro ao buscar serviçoes oferecidos:", error);
    });
  }, []);

  

  // Aqui esta pegando o serviço pelo id 
  const handleSelectChange = (e) => {
    if (servicos?.length > 0) {
      const selectedId = e.target.value;
      const servico = servicos.find((s) => s.id.toString() === selectedId);
  
      if (!servicosSelecionados.some(s => s.id === servico.id)) {
        setServicosSelecionados(prev => [...prev, servico]);
      }

    }
  };

  const onSubmit = (data) => {
    console.log('submit: ', data)
    const allDados = {
      ...data,
      servicosRequeridos: servicosSelecionados,
    }

    navigate('/dashboard/pets', {
      state:{
        all: allDados,
      }
    })
  }

  const onError = (errors) => {
    console.log('error ao enviar: ', errors)
  }

  return (
    <div>
      <div className={styles.tituloPage}>
        <h1>Cadastro de Cliente</h1>
        <hr />
      </div>

      <div className={styles.areaCadastro}>

        <form action="" onSubmit={handleSubmit(onSubmit, onError)} className={styles.estiloForm}>
          {/* Aqui é a área de nome e telefone */}
          <div className={styles.infoNomeTelefone}>

            <div className={styles.estiloCampos}>
              <label htmlFor="">Nome</label>
              <input className={styles.nome} placeholder="Digite o nome" type="text" {...register("nome", {
                required:"O nome é obrigatorio",
                minLength:{
                    value:10,
                    message:"O nome deve ter pelo menos 15 caracteres"
                },
                maxLength:{
                    value:80,
                    message:"O nome dever ter no maximo 100 caracteres"
                }
              })}/>
              {errors.nome && <p style={{color: 'red'}}>{errors.nome.message}</p>}
            </div>

            <div className={styles.estiloCampos}>
              <label htmlFor="">Telefone</label>
              <input type="text" placeholder="Digite o telefone" {...register("telefone", {
                required:"O telefone é obrigatorio",
                pattern: {
                  value: /^\d{2,2} \d{5,5}-\d{4,4}$/,
                  message: "Formato esperado: 27 99888-7766"
                }
              })}/>
              {errors.telefone && <p style={{color: 'red'}}>{errors.telefone.message}</p>}
            </div>

          </div>

          {/* Aqui é a área de endereço */}
          <div>
            <div className={styles.estiloTitulos}>
              <h3>Endereço</h3>
            </div>
            <hr />
            <CamposEndereco register={register} errors={errors}/>
          </div>
          
          {/* Aqui é a área de adicionar serviço requeridos */}
          <div>
              <h3>Serviços Requeridos</h3>
              <hr />
              <div>
                <div className={styles.estiloCampos}>
                  <label htmlFor="">Serviços</label>

                    <select {...register("servico", { required: false })} id="servico" onChange={handleSelectChange}>

                        <option value="">Selecione um serviço</option>

                        {servicos?.length > 0 && servicos.map((servico) => (
                            <option key={servico.id} value={servico.id}>{servico.nome}</option>
                        ))}

                    </select>

                </div>

                {/* Aqui vai ficar a logica de preencher a tabela com o nome e categoria do serviço */}
                <div className={styles.tabelaServicos}>
                  <table>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Categoria</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* No lugar de clientes, eu coloco o objeto serviços que irá ser retornado do banco */}
                      {servicosSelecionados.map((servico) => (
                        <tr key={servico.id}>
                          <td>{servico.nome}</td>
                          <td>{servico.nomeCategoria}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>

          <div className={styles.customizeBotaoCadastro}>
            <button type="submit">Cadastrar</button>
          </div>
        </form>

      </div>

    </div>
  )
}

export default CadastrarClientes