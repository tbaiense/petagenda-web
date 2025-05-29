import { useEffect,useState } from "react"
import { useForm } from "react-hook-form";
import api from  '../../api';
import { useAuth } from '../../contexts/UserContext';
import ModalCadastroFuncionario from "../../components/Modal Funcionario/ModalCadastroFuncionario";
import CardFuncionario from "../../components/CardFuncionario/CardFuncionario"
import styles from "./CadastroFuncionario.module.css"
import { tempFuncionarios } from "../../data/Tempdata";

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
        fetch(`${api.URL}/empresa/5/funcionario`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            // Converto os Serviços em JSON 
            .then(res => res.json())
            .then(data => {
                console.log(data.funcionarios)
                setFuncionarios(data.funcionarios);
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
            // exerce:[{
            //     servico: Number(data.servico)
            // }],
            // sexo: data.sexo,
        }

        fetch(`${api.URL}/empresa/5/funcionario`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(objFun)
        }).then( async res => { 
            if (res.status == 200) {
                alert('cadastrado');
                const json = await res.json()
                console.log(json)
            } else {
                alert('erro ao cadastrar funcionario');
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
                <hr />
            </div>

{/* ------------------------------------------------------------------------------------------------------------------------ */}
            {/* Aqui estou criando um modal para o usuario poder cadastrar rapidamente um novo funcionario */}
            {/* Podemos reutilizar esse modal para a aba da empresa futuramente */}

            <ModalCadastroFuncionario isOpen={showModal} onClose={() => setShowModal(false)}>

                <h2>Cadastro de Funcionario</h2>

                <form action="" className={styles.customeForm} onSubmit={handleSubmit(onSubmit, onError)}>

                    <div className={styles.areaNomeSexo}>
                        <div className={styles.controlaCampos}>
                            <label htmlFor="">Nome:</label>
                            <input type="text" placeholder="Digite o nome" 
                            {...register("nome", {
                                required:"O nome é obrigatorio",
                                minLength:{
                                    value:15,
                                    message:"O nome deve ter pelo menos 15 caracteres"
                                },
                                maxLength:{
                                    value:100,
                                    message:"O nome dever ter no maximo 100 caracteres"
                                }
                            })} />
                        </div>

                        <div className={styles.controlaCampos}>
                            <label htmlFor="">Sexo:</label>
                            <select {...register("sexo", { required: "Selecione um sexo" })}>
                                <option value="">Sexo</option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        </div>

                    </div>
                    
                    <div>

                        <div className={styles.controlaCampos}>
                            <label htmlFor="">Serviço Prestado:</label>
                            {/* VAi FUNIONAR DEPOIS*/}
                            <select {...register("servico", { required: "Selecione um serviço" })}>

                                <option value="">Selecione um serviço</option>

                                {servicos.map((servico) => (
                                    <option key={servico.id} value={servico.id}>{servico.nome}</option>
                                ))}

                            </select>
                        </div>

                        <div className={styles.controlaCampos}>
                            <label htmlFor="">Telefone:</label>
                            <input type="text" placeholder="Digite o telefone" 
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
                        </div>

                    </div>
                    
                    <div className={styles.posicaoBotaoForm}>
                        <button type="submit">Cadastrar</button>
                    </div>
                    

                </form>

            </ModalCadastroFuncionario>
{/* ------------------------------------------------------------------------------------------------------------------------ */}
            {/* Aqui eu estou gerando a lista de funcionarios */}
            <div>
                <table className={styles.tabelaBonita}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Serviço</th>
                            <th>Sexo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tempFuncionarios.map((tempFuncionario, index) => {
                            return (
                                <tr key={index}>
                                    <td>{tempFuncionario.nome}</td>
                                    <td>{tempFuncionario.telefone}</td>
                                    <td>{tempFuncionario.servico}</td>
                                    <td>{tempFuncionario.sexo}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Ao clicar em um "botão" abre um modal para cadastrar um novo funcionario */}
            <div className={styles.estiloBotao}>
                <button onClick={() => setShowModal(true)}>Adicionar</button>
            </div>

        </div>
    )
}

export default CadastroFuncionario