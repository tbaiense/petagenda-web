import { useEffect, useState } from "react"
import styles from "./Cadastrar_Pets.module.css"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../contexts/UserContext';
import { useForm } from "react-hook-form";

const CadastrarPets = () => {
  const navigate = useNavigate();

  // const locate = useLocation()
  // const infoCliente = locate.state
  const [clientes, setClientes] = useState([])
  const [ clienteEscolhido, setClienteEscolhido ] = useState({});
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


  // Verifica se há dados da pagina de cliente
  // if (!infoCliente) {
  //   // Se chegou até aqui e porque o usuario não cadastrou um cliente 
  //   // Logo, a API vai pegar todos os clientes para carregar a comboBox
  //   empresaFetch('/cliente')
  //   // Converto os clientes em JSON 
  //   .then(res => res.json())
  //   .then(data => {
  //       setServicos(data);
  //   })
  //   .catch(error => {
  //       console.error("Erro ao buscar Clientes:", error);
  //   });
  // }

  const cadastrarPet = async (pet) => {
    try {
      const res = await empresaFetch('/pet', {
          method: "POST",
          body: JSON.stringify(pet)
      });

      const jsonBody = await res.json();

      if (res.status == 200) {
        const idPet = jsonBody.id;

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
    setPet(data); // TODO: criar objeto certo para cadastro de pet

    cadastrarPet(pet);
  }

  const onErrors = (errors) => {
    console.log(errors)
  }

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
                {/* {infoCliente ? (
                  <option value={infoCliente.id}>{infoCliente.nome}</option>
                ) : (
                  <>
                    <option value="">Selecione um dono</option>
                    {clientes.map((cliente, index) => (
                      <option value={cliente.id} key={index}>{cliente.nome}</option>
                    ))}
                  </>
                )} */}
              </select>
            </div>

            <div className={styles.estiloCampos}>
              <label>Nome do Pet</label>
              <input type="text" placeholder="Digite o nome do pet" {...register("nomePet", { required: true })} />
            </div>
          </div>


          <div className={styles.linhaDoisCampos}>

            {/* Colocar um select em vez de input */}
            <div className={styles.estiloCampos}>
              <label>Espécie</label>
              <input type="text" placeholder="Digite a espécie" {...register("especie", { required: true })} />
            </div>

            <div className={styles.estiloCampos}>
              <label>Raça</label>
              <input type="text" placeholder="Digite a raça" {...register("raca", { required: true })} />
            </div>

          </div>

          <div className={styles.linhaDoisCampos}>
            <div className={styles.estiloCampos}>
                <label htmlFor="">Cor</label>
                <input type="text" name="" id="" placeholder="Digite a cor" {...register("raca", { required: true })}/>
            </div>
            <div className={styles.estiloCampos}>
                <label htmlFor="">Porte</label>
                <select name="" id="" {...register("raca", { required: true })}>
                  <option value="">Selecione</option>
                  <option value="">Grande Porte</option>
                  <option value="">Médio Porte</option>
                  <option value="">Pequeno Porte</option>
                </select>
            </div>
          </div>


          <div className={styles.linhaComCheckbox}>

            <div className={styles.estiloCampos}>
              <input type="checkbox" checked={aceito} onChange={(e) => setAceito(e.target.checked)} />
              <label style={{ marginLeft: "0.5rem" }}>Castrado?</label>
            </div>

            <div className={styles.estiloCampos}>
              <label>Sexo</label>
              <select {...register("sexo", { required: true })}>
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
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
                  value: 150,
                  message: "O máximo de caracteres é 150."
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
            <textarea className={styles.inputTextArea} placeholder="Descreva a saúde do pet"
              {...register("saude", {
                maxLength: {
                  value: 150,
                  message: "O máximo de caracteres é 150."
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