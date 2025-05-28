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
      <div>
        <h1>Cadastro de Cliente</h1>
        <hr />
      </div>


      <form action="" onSubmit={handleSubmit(onSubmit, onError)} className={styles.estiloForm}>
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
          <CamposEndereco/>
          {enderecosExtras.map((_,index) => (
            <CamposEndereco key={index} index={index} onRemove={() => removerEndereco(index)}/>
          ))}
    
        </div>
        
        {/* Aqui é a área de adicionar serviço requeridos */}
        <div>
            <h3>Serviços Requeridos</h3>
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
        
        <button type="submit">Cadastrar</button>
      </form>
      
        
    
    </div>
  )
}

export default CadastrarClientes