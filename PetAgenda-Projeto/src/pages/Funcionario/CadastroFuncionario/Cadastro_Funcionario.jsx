import { useEffect,useState } from "react"
import { useForm } from "react-hook-form";
import { useAuth } from '../../../contexts/UserContext';
import ModalCadastroFuncionario from "../../../components/ModalFuncionario/ModalCadastroFuncionario";
import CardFuncionario from "../../../components/CardFuncionario/CardFuncionario"
import styles from "./Cadastro_Funcionario.module.css"

const CadastroFuncionario = () => {
    const { empresaFetch, validar } = useAuth();
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

    function popularListaFuncionarios() {
        // Pego os funcionarios do banco da empresa
        empresaFetch('/funcionario')
            .then(res => res.json())
            .then(data => {
                setFuncionarios(data.funcionarios);
            })
            .catch(error => {
                console.error("Erro ao buscar Funcionarios:", error);
            });

        // Pego os funcionarios do banco da empresa
        empresaFetch('/servico-oferecido')
        .then(res => res.json())
        .then(data => {
            setServicos(data.servicosOferecidos);
        })
        .catch(error => {
            console.error("Erro ao buscar serviços oferecidos:", error);
        });
    }

    // Thiago eu não sei qual verificação fazer para conseguir retornar todos os funcionarios
    // Se eu tiver feito errado, por favor corriga e me informa para eu saber o que eu errei

    useEffect(() => {
        if (validar) {
            popularListaFuncionarios();
        }
    }, []);

    // Ao Finalizar o Cadastro, a pagina recarrega e adiciona o novo funcionario a lista
    const onSubmit = async (data) => {
        const objFun = {
            nome: data.nome,
            telefone: data.telefone,
            exerce:[{
                id: Number(data.servico)
            }],
        }

        empresaFetch('/funcionario', { method: "POST", body: JSON.stringify(objFun) })
            .then( async res => { 
            if (res.status == 200) {
                const json = await res.json()
                popularListaFuncionarios();
                alert(json.message);
            } else {
                alert('erro ao cadastrar funcionario');
            }
            reset();
            setShowModal(false);
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

                <form id="form-func"  action="" className={styles.customeForm} onSubmit={handleSubmit(onSubmit, onError)}>

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
                    </div>
                    
                    <div>

                        <div className={styles.controlaCampos}>
                            <label htmlFor="">Serviço Prestado:</label>
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
                        </tr>
                    </thead>
                    <tbody>
                        {funcionarios && funcionarios.map((func) => {
                            const servExerce = servicos.flatMap( serv => {
                                if (serv.id == func.exerce[0].servico) {
                                    return serv.nome;
                                } else {
                                    return [];
                                }

                            });
                            return (
                                <tr key={func.id}>
                                    <td>{func.nome}</td>
                                    <td>{func.telefone}</td>
                                    <td>{servExerce.length > 0 && servExerce[0]}</td>
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