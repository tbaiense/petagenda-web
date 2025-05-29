import styles from "./CadastrarClientes.module.css"
import { useForm } from "react-hook-form"
import { useEffect,useState } from "react";
import { clientes } from "../../data/testeDeTabela";
import api from  '../../api';
import { useAuth } from '../../contexts/UserContext';
import CamposEndereco from "../../components/Endereco/CamposEndereco";
import { useNavigate } from "react-router-dom";

const CadastrarClientes = () => {
  const { token } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [enderecosExtras, setEnderecosExtras] = useState([]);
  const navigate = useNavigate()

  const {
      register,
      handleSubmit,
      formState:{errors},
      reset,
      watch
  } = useForm();

  useEffect(() => {
    // Pego os Serviços oferecidos do banco de dados
    fetch(`${api.URL}/empresa/:id/servicos-oferecido`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
        // Converto os Serviços em JSON 
        .then(res => res.json())
        .then(data => {
            setServicos(data);
        })
        .catch(error => {
            console.error("Erro ao buscar Serviços:", error);
        });
  }, []);

  const onSubmit = (data) => {
    navigate('/dashboard/pets', {
      state:{
        all: data
      }
    })
  }

  const onError = (data) => {
    console.log(data)
  }
  const adicionarEndereco = () => {
    console.log("Adicionando endereço extra");
    setEnderecosExtras(prev => [...prev,{}]);
  }
  const removerEndereco = (indexToRemove) => {
    setEnderecosExtras(prev => prev.filter((_, index) => index !== indexToRemove));
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
            </div>

            <div className={styles.estiloCampos}>
              <label htmlFor="">Telefone</label>
              <input type="text" placeholder="Digite o telefone" {...register("telefone", {
                required:"O telefone é obrigatorio",
                minLength:{
                    value:14,
                    message:"O telefone deve ter pelo menos 14 caracteres"
                },
                maxLength:{
                    value:14,
                    message:"O telefone dever ter no maximo 14 caracteres"
                }
              })}/>
            </div>

          </div>

          {/* Aqui é a área de endereço */}
          <div>
            <div className={styles.estiloTitulos}>
              <h3>Endereço</h3>
              <button
                type="button"
                onClick={adicionarEndereco}
                disabled={enderecosExtras.length >= 1}
              >
                +
              </button>

              <button
                type="button"
                onClick={() => {
                  if (enderecosExtras.length > 0) {
                    removerEndereco(enderecosExtras.length - 1);
                  }
                }}
                disabled={enderecosExtras.length === 0} // desabilita se não tiver extras
              >
                -
              </button>
            </div>
            <hr />
            <CamposEndereco register={register}/>
            {enderecosExtras.map((_,index) => (
              <CamposEndereco key={index} register={register} index={index} onRemove={() => removerEndereco(index)}/>
            ))}
      
          </div>
          
          {/* Aqui é a área de adicionar serviço requeridos */}
          <div>
              <h3>Serviços Requeridos</h3>
              <hr />
              <div>
                <div className={styles.estiloCampos}>
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
                      {clientes.map((cliente,index) => (
                        <tr key={index}>
                          <td>{cliente.nome}</td>
                          <td>{cliente.telefone}</td>
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