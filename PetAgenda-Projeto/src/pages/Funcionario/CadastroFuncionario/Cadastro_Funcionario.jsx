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
        watch,
        setValue
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

    useEffect(() => {
        if (validar) {
            popularListaFuncionarios();
        }
    }, []);

    function cadastrarFuncionario(objFun) {
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

    // Ao Finalizar o Cadastro, a pagina recarrega e adiciona o novo funcionario a lista
    const onSubmit = async (data) => {
        const objFun = {
            nome: data.nome,
            telefone: data.telefone,
            exerce:[{
                id: Number(data.servico)
            }],
        }

        if (validar) {
            cadastrarFuncionario(objFun);
        }
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
                            <label htmlFor="">Nome<span style={{color: 'red'}}>*</span>:</label>
                            <input type="text" placeholder="Digite o nome" 
                            {...register("nome", {
                                required: {
                                    value: true,
                                    message: "O nome é obrigatorio"
                                },
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
                                    value: 3,
                                    message:"O nome deve ter pelo menos 3 caracteres"
                                },
                                maxLength:{
                                    value: 64,
                                    message:"O nome dever ter no maximo 64 caracteres"
                                }
                            })} />
                            {errors.nome && <p style={{color: 'red'}}>{errors.nome.message}</p>}
                        </div>
                    </div>
                    
                    <div>

                        <div className={styles.controlaCampos}>
                            <label htmlFor="">Serviço Exercido<span style={{color: 'red'}}>*</span>:</label>
                            <select {...register("servico", { required: {
                                    value: true,
                                    message: "Selecione um serviço exercido"
                                } })}>

                                <option value="">Selecione um serviço</option>

                                {servicos.map((servico) => (
                                    <option key={servico.id} value={servico.id}>{servico.nome}</option>
                                ))}
                            </select>
                            {errors.servico && <p style={{color: 'red'}}>{errors.servico.message}</p>}
                        </div>

                        <div className={styles.controlaCampos}>
                            <label htmlFor="">Telefone<span style={{color: 'red'}}>*</span>:</label>
                            <input type="text" placeholder="Digite o telefone" 
                            {...register("telefone", {
                                required: {
                                    value: true,
                                    message: "O telefone é obrigatorio"
                                },
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
                                },
                                minLength:{
                                    value:13,
                                    message:"O telefone deve ter pelo menos 13 caracteres"
                                },
                                maxLength:{
                                    value:14,
                                    message:"O telefone dever ter no maximo 15 caracteres"
                                }
                            })}/>
                            {errors.telefone && <p style={{color: 'red'}}>{errors.telefone.message}</p>}
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