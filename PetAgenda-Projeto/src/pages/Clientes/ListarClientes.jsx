
import { useEffect,useState } from "react"
import { useAuth } from "../../contexts/UserContext";
import CardCliente from "../../components/CardCliente/CardCliente"
import styles from "./ListarClientes.module.css"
import { useNavigate } from "react-router-dom";
import { Input } from 'antd';
import iconEditar from "../../assets/icon_editarAzul.svg"
import iconDeletar from "../../assets/icon_delete.svg"
import seta from "../../assets/icon_seta.svg"

const { Search } = Input;

const ListarClientes = () => {
    const { empresaFetch, validar } = useAuth();
    const [ clientes, setClientes] = useState([]);
    const [ clientView, setClientView ] = useState({});
    const navigate = useNavigate();
    const [ pesquisando, setPesquisando ] = useState(false);
    const [showInfo, setShowInfo] = useState(false)

    async function popularListaClientes() {
        // Pego os Clientes do banco da empresa
        empresaFetch('/cliente')
        .then(res => res.json())
        .then(data => {
            setClientes(data.clientes);
        })
        .catch(error => {
            console.error("Erro ao buscar Clientes:", error);
        });
    }

    async function deletarCliente(id) {
        try {
            const response = await empresaFetch(`/cliente/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
                console.log('Cliente deletado com sucesso!');
            } else {
                console.error('Erro ao deletar cliente');
            }
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
        }
    }

    // Função para pegar os pets do dono selecionado
    async function popularPetsCliente(id) {
        empresaFetch(`/pet?idCliente=${id}`)
        .then(res => res.json())
        .then(data => {
            setPetsCliente(data.pets);
        })
        .catch(error => {
            console.error("Erro ao buscar Clientes:", error);
        });
    }
    useEffect(() => {
        if (validar) {
            popularListaClientes();
            console.log(clientes)
        }
    }, []);

    const navEditarCliente = ( cliente ) => {
        navigate(`/empresa/clientes/editar/${cliente.id}`, { state:cliente })
    }

    return(
        <div className={styles.viewConteudo}>
            <div>
                <h1>Clientes Cadastrados</h1>
                <hr />
            </div>
            <div className={styles.alinhamento}>
                <div className={styles.orgContent}>
                    <div className={styles.pesquisa}>
                        <Search placeholder="Pesquise pelo cliente..." enterButton="Search" size="large" loading={pesquisando} onChange={(e) => {setPesquisando(!pesquisando)}}/>                    
                    </div>
                    <div className={styles.filtros}>
                        <div>
                            <label htmlFor="">Filtrar por:</label>
                            <select name="" id="" className={styles.slct}>
                                <option value="">Nome</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Ordenação:</label>
                            <select name="" id="" className={styles.slct}>
                                <option value="">Crescente</option>
                                <option value="">Decrescente</option>
                            </select>
                        </div>

                    </div>
                    {clientes?.length > 0 ? (
                        clientes?.map((cliente) => (
                        <div key={cliente.id} className={styles.cardInfo}>
                            <div>
                                <span className={styles.nomeCliente}>{cliente.nome}</span>
                                <div className={styles.layoutInfoPerson}>
                                    <span>{cliente.telefone}</span>
                                    <span>|</span>
                                    <div>
                                        <span>{cliente.endereco.cidade}, {cliente.endereco.estado}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.position}>
                                <div className={styles.position2}>
                                    <div className={styles.alinhamentoImage}>
                                        <img src={iconEditar} alt="" onClick={() => navEditarCliente(cliente)}/>
                                    </div>
                                    <div className={styles.alinhamentoImage}>
                                        <img src={iconDeletar} alt="" onClick={() => {
                                            if (confirm('Deseja realmente deletar este cliente?')) {
                                                deletarCliente(cliente.id);
                                            }
                                        }}/>
                                    </div>
                                </div>
                                <div>
                                    <img src={seta} alt="" onClick={() => {
                                        setClientView(cliente)
                                        setShowInfo(true);
                                    }}/>
                                </div>
                            </div>
                        </div>
                        ))
                    ) : (
                        <div>
                            <span className={styles.cardInfo}>Nenhum serviço cadastrado</span>
                        </div>
                    )}
                </div>
            </div> 

            {showInfo && (
                <div className={styles.infoModal}>
                    <div className={styles.estiloModal}>
                        <div className={styles.estiloTitulo}>
                            <h2>{clientView.nome}</h2>
                        </div>
                        <div className={styles.quadro}>
                            <div className={styles.tele}>
                                <label htmlFor="">Telefone:</label>
                                <span>{clientView.telefone}</span>
                            </div>
                            <div>
                                <label htmlFor="">Serviço(s) Favorito(s):</label>
                                {clientView.servicoRequerido?.length > 0 ? (
                                    clientView.servicoRequerido.map((servico, index) => (
                                        <div className={styles.servicosFavority}>
                                            <span readOnly key={index}>{servico.nome}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        <span>Nenhum serviço favorito cadastrado</span>
                                    </div>
                                )}
                            </div>
                            <div className={styles.estiloEndereco}>
                                <label htmlFor="">Endereço:</label>
                                <span>{
                                    `${clientView.endereco.logradouro},
                                    ${clientView.endereco.numero}, 
                                    ${clientView.endereco.bairro}, 
                                    ${clientView.endereco.cidade}-${clientView.endereco.estado}`}</span>
                            </div>
                        </div>
                        <div className={styles.spanFechar}>
                            <button className={styles.spanFechar} onClick={() => {setShowInfo(false)}}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}  

        </div>
    )
}

export default ListarClientes;