import styles from "./Cadastrar_Clientes.module.css"
import { useForm } from "react-hook-form"
import { useEffect,useState } from "react";
import { clientes } from "../../data/testeDeTabela";
import { useAuth } from '../../contexts/UserContext';
import CamposEndereco from "../../components/Endereco/CamposEndereco";
import { useNavigate } from "react-router-dom";

const CadastrarClientes = () => {
  const { empresaFetch, validar } = useAuth();
  const [ servicos, setServicos] = useState([]);
  const [ endereco, setEndereco ] = useState({});
  const [ cep, setCep ] = useState("");

  const navigate = useNavigate()
  const [servicosSelecionados, setServicosSelecionados] = useState([]);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState:{errors},
    subscribe,
    reset,
    watch
} = useForm();

  async function preencherEnderecosCEP(cep) {
    try {
      const endRes = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      /*
      {
        "cep": "29149-999",
        "logradouro": "Rua...",
        "complemento": "",
        "unidade": "",
        "bairro": "",
        "localidade": "",
        "uf": "ES",
        "estado": "Espírito Santo",
        "regiao": "Sudeste",
        "ibge": "3201308",
        "gia": "",
        "ddd": "27",
        "siafi": "5625"
      }
      */
  
      if (endRes.status == 200) {
        console.log('fetch cep');

        const jsonBody = await endRes.json();
        if (!jsonBody.erro) {
          const endFound = {
            logradouro: jsonBody.logradouro,
            bairro: jsonBody.bairro,
            numero: "",
            cidade: jsonBody.localidade,
            estado: jsonBody.uf,
          }
  
          const entries = Object.entries(endFound);
  
          for (const [key, value] of entries) {
            setValue(`endereco.${key}`, value, { shouldTouch: true });
          }
        }
      } else {
        throw new Error("Falha ao obter informaçoes de endereço a partir de CEP");
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  // Verificação de CEP
  useEffect(() => {
    if (cep?.length == 8 && cep.match(/^\d{5,5}\d{3,3}$/)) {
      preencherEnderecosCEP(cep);
    }
  }, [cep]);

  function handleEnderecoChange(e) {
    const newEnd = {...endereco };
    newEnd[e.target.name.split('.')[1]] = e.target.value;
    
    setEndereco(newEnd);
    setValue(e.target.name.split('.')[1], e.target.value);
  }
  
  // Pego os serviços oferecidos do banco da empresa
  useEffect(() => {
    if (validar) {
      empresaFetch('/servico-oferecido')
      .then(res => res.json())
      .then(data => {
          setServicos(data.servicosOferecidos);
      })
      .catch(error => {
          console.error("Erro ao buscar serviçoes oferecidos:", error);
      });
    }
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

  async function cadastrarCliente(objCli) {
    return empresaFetch('/cliente', { method: "POST", body: JSON.stringify(objCli) })
    .then( async res => { 
        if (res.status == 200) {
            const json = await res.json()

            return json;
        } else {
            alert('erro ao cadastrar cliente');
        }
    });
  }

  const onSubmit = async (data) => {
    console.log('submit: ', data)
    const objCli = {
      ...data,
      servico: undefined,
      servicoRequerido: servicosSelecionados.map( s => ({ servico: s.id })),
    }

    if (validar) {
      const jsonResp = await cadastrarCliente(objCli);
      if (jsonResp.success) {
        alert(jsonResp.message);
        reset();
        setServicosSelecionados([]);

        navigate(`/empresa/clientes/lista`);
      }
    }
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
              <input 
                className={styles.nome} 
                placeholder="Digite o nome" 
                type="text" 
                {...register("nome", {
                required:"O nome é obrigatorio",
                onChange: (e) => {
                  let value = e.target.value;

                  if (value && value.length > 0) {
                    let values = value.split(' ');
                    values = values.map( v => `${v.charAt(0).toUpperCase()}${v.substring(1)}` );
                    value = values.join(' ');
                  }
                  setValue(e.target.name, value);
                },
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
              <input type="text" placeholder="27 99988-7766" {...register("telefone", {
                required:"O telefone é obrigatorio",
                pattern: {
                  value: /^\d{2,2} \d{5,5}-\d{4,4}$/,
                  message: "Formato esperado: 27 99888-7766",
                },
                onChange: (e) => {
                  let value = e.target.value;

                  if (value && value.length > 0) {
                    value = value.replaceAll(/[^0-9]/g, '');
                    value = `${value.substring(0,2)}${(value.length > 2) ? " " : "" }${value.substring(2,7)}${(value.length > 7) ? "-" : "" }${value.substring(7,11)}`;
                    console.log('limpei')
                  }
                  setValue(e.target.name, value);
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
            <CamposEndereco 
              setValue={setValue}
              cep={cep}
              setCep={setCep}
              endereco={endereco}
              handleChange={handleEnderecoChange}
              register={register} 
              errors={errors}/>
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