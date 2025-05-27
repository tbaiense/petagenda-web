import { useEffect,useState } from "react"
import { useForm } from "react-hook-form";
import api from  '../../api';
import { useAuth } from '../../contexts/UserContext';
import ModalCadastroFuncionario from "../../components/Modal Funcionario/ModalCadastroFuncionario";
import CardFuncionario from "../../components/CardFuncionario/CardFuncionario"
import styles from "./CadastroFuncionario.module.css"

const CadastroFuncionario = () => {
    const { token } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [funcionarios, setFuncionarios] = useState([]);
    const [servicos, setServicos] = useState([]);


    const {
        register,
        handleSubmit,
        formState:{errors},
        reset,
        watch
    } = useForm();


    // Thiago eu não sei qual verificação fazer para conseguir retornar todos os funcionarios
    // Se eu tiver feito errado, por favor corriga e me informa para eu saber o que eu errei

    useEffect(() => {
        // Pego os funcionarios do banco da empresa
        fetch(`${api.URL}/empresa/:id/funcionario`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            // Converto os Serviços em JSON 
            .then(res => res.json())
            .then(data => {
                setFuncionarios(data);
            })
            .catch(error => {
                console.error("Erro ao buscar Funcionarios:", error);
            });

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

    // Ao Finalizar o Cadastro, a pagina recarrega e adiciona o novo funcionario a lista
    const onSubmit = async (data) => {
        const objFun = {
            nome: data.nome,
            telefone: data.telefone,
            exerce:[{
                servico: Number(data.servico)
            }],
            sexo: data.sexo,
        }

        fetch(`${api.URL}/empresa/:id/funcionario`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(objFun)
        }).then( res => { 
            if (res.status == 200) {
                alert('cadastrado');
                navigate("/dashboard/Planos")
            } else {
                alert('erro ao cadastrar empresa');
            }
        });

    }
    const onError = (errors) => {
        console.log("Erro ao Enviar",errors)
    }


    return(
        <div className={styles.viewConteudo}>
            <div>
                <h1>Funcionarios Cadastrados</h1>
                {/* Ao clicar em um "botão" abre um modal para cadastrar um novo funcionario */}
                <p onClick={() => setShowModal(true)}>Adicionar</p>
            </div>

            {/* Aqui estou criando um modal para o usuario poder cadastrar rapidamente um novo funcionario */}
            {/* Podemos reutilizar esse modal para a aba da empresa futuramente */}

            <ModalCadastroFuncionario isOpen={showModal} onClose={() => setShowModal(false)}>

                <h2>Cadastro de Funcionario</h2>

                <form action="" onSubmit={handleSubmit(onSubmit, onError)}>

                    <input type="text" placeholder="Nome:" 
                    {...register("nome", {
                        required:"O nome é obrigatorio",
                        minLength:{
                            value:10,
                            message:"O nome deve ter pelo menos 15 caracteres"
                        },
                        maxLength:{
                            value:80,
                            message:"O nome dever ter no maximo 100 caracteres"
                        }
                    })} />

                    <input type="text" placeholder="Telefone:" 
                    {...register("telefone", {
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
                    
                    <select {...register("servico", { required: "Selecione um serviço" })}>

                        <option value="">Selecione um serviço</option>

                        {servicos.map((servico) => (
                            <option key={servico.id} value={servico.id}>{servico.nome}</option>
                        ))}

                    </select>

                    <select {...register("sexo", { required: "Selecione um sexo" })}>
                        <option value="">Sexo</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </select>

                    <button>Cadastrar</button>
                </form>

            </ModalCadastroFuncionario>

            {/* Aqui eu estou gerando a lista de funcionarios */}
            <div className={styles.layoutFuncionario}>
                {funcionarios.map((funcionario, index) => (
                <CardFuncionario
                    key={index}
                    nome={funcionario.nome}
                    telefone={funcionario.telefone}
                    servico={funcionario.servico}
                    sexo={funcionario.sexo}
                />
                ))}
            </div>

        </div>
    )
}

export default CadastroFuncionario