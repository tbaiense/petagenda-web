import { useEffect, useState } from "react"
import styles from "./Cadastrar_Pets.module.css"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../contexts/UserContext';
import { useForm } from "react-hook-form";

const CadastrarPets = () => {

  const navigate = useNavigate();
  const [clientes, setClientes] = useState([])
  const [ clienteEscolhido, setClienteEscolhido ] = useState({});
  const [ especies, setEspecies ] = useState();
  const [ pet, setPet ] = useState();
  const { empresaFetch } = useAuth();
  const [aceito, setAceito] = useState(false);

  const {
      register,
      handleSubmit,
      formState:{errors},
      reset,
      watch
  } = useForm();

  const cadastrarPet = async (pet) => {
    const jsonPet = JSON.stringify(pet);
    console.log("novo: ",jsonPet);
    try {
      const res = await empresaFetch('/pet', {
          method: "POST",
          body: JSON.stringify(pet)
      });

      const jsonBody = await res.json();

      if (res.status == 200) {
        const idPet = jsonBody.pet.id;

        alert('cadastrado');
        navigate(`/empresa/pets/${idPet}`);
      } else {
          alert('erro ao cadastrar pet');
      }
    } catch (err) {
      alert('Falha ao cadastrar pet: ' + err.message);
    }
  };

  const onSubmit = (data) => {
    const newPet = {
      dono: {
          id: data.clienteId
      },
      especie: {
          id: data.especie
      },
      nome: data.nome,
      sexo: data.sexo,
      porte: data.porte,
      eCastrado: data.eCastrado,
      estadoSaude: "saudável",
      raca: "",
      cor: "",
      comportamento: "",
      cartaoVacina: null
    };
    console.log("novo: ", newPet);

    cadastrarPet(newPet);
  }

  const onErrors = (errors) => {
    console.log(errors)
  }

  async function obterClientes() {
    try {
      const cliResp = await empresaFetch('/cliente');

      if (cliResp.status == 200) {
        const jsonBody = await cliResp.json();

        if (!jsonBody) {
          throw new Error("servidor enviou corpo vazio");
        }

        if (!jsonBody.clientes) {
          throw new Error(jsonBody.message);
        }

        if (jsonBody.clientes.length == 0) {
          return [];
        } else {
          return jsonBody.clientes;
        }
      } else {
        throw new Error('requisição não retornou código 200');
      }
    } catch (err) {
      err.message = "Falha ao obter clientes cadastrados: " + err.message;
      throw err;
      // return [];
    }
  }

  async function obterEspecies() {
    try {
      const espResp = await empresaFetch('/pet/especie');

      if (espResp.status == 200) {
        const jsonBody = await espResp.json();
        if (!jsonBody) {
          throw new Error("servidor enviou corpo vazio");
        }
        
        if (!jsonBody.especiesPet) {
          throw new Error(jsonBody.message);
        }

        return jsonBody.especiesPet;

      } else {
        throw new Error('requisição não retornou código 200');
      }
    } catch (err) {
      err.message = "Falha ao obter espécies cadastradas: " + err.message;
      throw err;
      // return [];
    }
  }

  
  useEffect(() => {
    // Populando clientes
    obterClientes()
      .then( cliList => {
        setClientes(cliList);
        console.log('clientes encontrados: ', cliList);
      })
      .catch( err => {
        alert(err.message);
      });

    // Populando espécies
    obterEspecies()
      .then( espList => {
        setEspecies(espList);
      })
      .catch( err => {
        alert(err.message);
      });
  }, []);

  return (
    <div> 

      <div className={styles.titulo}>
        <h1>Cadastrar Pet</h1>
        <hr />
      </div>

      <div className={styles.layoutCadastro}>

        <form action="" onSubmit={handleSubmit(onSubmit, onErrors)} className={styles.previnindoVazamento}>

          <div className={styles.linhaDoisCampos}>

            <div className={styles.estiloCampos}>
              <label>Dono</label>
              <select {...register("clienteId", { required: true })}>
                <option value="">Selecione um dono</option>
                    {clientes.map((cliente) => (
                      <option value={cliente.id} key={cliente.id}>{cliente.nome}</option>
                    ))}
              </select>
            </div>

            <div className={styles.estiloCampos}>
              <label>Nome do Pet</label>
              <input type="text" placeholder="Digite o nome do pet" {...register("nome", { 
                required: { value: true, message: "Nome do pet é obrigatório"},
                maxLength: { value: 64, message: "Nome deve ser de até 64 caracteres"}
                })} />
            </div>
          </div>


          <div className={styles.linhaDoisCampos}>
            <div className={styles.estiloCampos}>
              <label>Espécie</label>
              <select id="especie-select" {...register("especie", {
                required: {
                  value: true,
                  message: "Espécie do Pet precisa ser definida"
                }
              })}>
                { especies && especies.map( esp => {
                  return (
                    <option value={esp.id} key={esp.id}>{esp.nome}</option>
                  );
                })}
              </select>
            </div>

            <div className={styles.estiloCampos}>
              <label>Raça</label>
              <input type="text" placeholder="Digite a raça" {...register("raca", { 
                required: false,
                maxLength: {
                  value: 64,
                  message: "Tamanho máximo é de 64 caracteres."
                } 
                })} />
            </div>

          </div>

          <div className={styles.linhaDoisCampos}>
            <div className={styles.estiloCampos}>
                <label htmlFor="">Cor</label>
                <input type="text" name="" id="" placeholder="Escreva a cor" {...register("cor", { required: false, maxLength: { value: 16, message: "Cor deve ser entre 0 e 16 caracteres."} })}/>
            </div>
            <div className={styles.estiloCampos}>
                <label htmlFor="">Porte</label>
                <select name="porte" id="" {...register("porte", { required: true })}>
                  <option value="">Selecione</option>
                  <option value="G">Grande</option>
                  <option value="M">Médio</option>
                  <option value="P">Pequeno</option>
                </select>
            </div>
          </div>


          <div className={styles.linhaComCheckbox}>

            <div className={styles.estiloCampos}>
              <input type="checkbox" checked={aceito} onChange={(e) => setAceito(e.target.checked)} 
                { ...register("eCastrado", { required: false }) }
              />
              <label style={{ marginLeft: "0.5rem" }}>Castrado?</label>
            </div>

            <div className={styles.estiloCampos}>
              <label>Sexo</label>
              <select {...register("sexo", { required: {value: true, message: "O sexo do Pet precisa ser definido"} })}>
                <option value="">Selecione</option>
                <option value="M">Macho</option>
                <option value="F">Fêmea</option>
              </select>
            </div>

            <div className={styles.estiloCampos}>
              <label htmlFor="">Data de Nascimento</label>
              <input type="date" />
            </div>

          </div>

          <div className={`${styles.estiloCampos}`}>
            <label>Comportamento</label>
            <textarea className={styles.inputTextArea} placeholder="Descreva o comportamento do pet"
              {...register("comportamento", {
                maxLength: {
                  value: 64,
                  message: "O máximo de caracteres é 64."
                }
              })}
            />
          </div>

          <div className={styles.cartaoVacina}>

            <div>

              <h2>Saúde</h2>
              <hr /> 

              <div className={styles.inputFile}>
                <label>Cartão de Vacina</label>
                <input type="file" />
              </div>
              
            </div>

            <label>Saúde</label>
            <textarea className={styles.inputTextArea} placeholder="Descreva o estado de saúde do pet"
              {...register("estadoSaude", {
                maxLength: {
                  value: 32,
                  message: "O máximo de caracteres é 32."
                }
              })}
            />
          </div>
          
          <div className={styles.botton}>
            <button type="submit">Cadastrar</button>
          </div>
          
        </form>

      </div>

    </div>
  )
}

export default CadastrarPets