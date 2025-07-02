
import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/UserContext";
import CardCliente from "../../components/CardCliente/CardCliente"
import styles from "./ListarClientes.module.css"
import { useNavigate } from "react-router-dom";
import { Input } from 'antd';
import iconEditar from "../../assets/icon_editarAzul.svg"
import iconDeletar from "../../assets/icon_delete.svg"
import seta from "../../assets/icon_seta.svg"
import { Col, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal"

const { Search } = Input;

const ListarClientes = () => {
    const { empresaFetch, validar } = useAuth();
    const [clientes, setClientes] = useState([]);
    const [clientView, setClientView] = useState({});
    const navigate = useNavigate();

    const [pesquisando, setPesquisando] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [ordenacao, setOrdenacao] = useState('ascending');
    const [tipoFiltro, setTipoFiltro] = useState('nome');

    const [showInfo, setShowInfo] = useState(false)

    async function popularListaClientes() {
        // Pego os Clientes do banco da empresa
        setPesquisando(true);
        empresaFetch(`/cliente?query=${searchQuery}&option=${tipoFiltro}&ordenacao=${ordenacao}`)
            .then(res => res.json())
            .then(data => {
                setClientes(data.clientes);
            })
            .catch(error => {
                console.error("Erro ao buscar Clientes:", error);
            });
    }
    const handleClose = () => { setShowInfo(false) }

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
        }
    }, [searchQuery]);

    useEffect(() => {
        setPesquisando(false);
    }, [clientes]);

    const navEditarCliente = (cliente) => {
        navigate(`/empresa/clientes/editar/${cliente.id}`, { state: cliente })
    }

    return (
        <div className={styles.viewConteudo}>
            <div>
                <h1>Clientes Cadastrados</h1>
                <hr />
            </div>
            <div className={styles.alinhamento}>
                <div className={styles.orgContent}>
                    <div className={styles.pesquisa}>
                        <Search
                            placeholder="Digite o que deseja pesquisar..."
                            enterButton="Pesquisar"
                            size="large"
                            loading={pesquisando}
                            allowClear={true}
                            onClear={() => {
                                setPesquisando(false);
                                setSearchQuery('');
                            }}
                            onPressEnter={(e) => {
                                if (pesquisando) {
                                    setPesquisando(false);
                                }
                            }}
                            onSearch={(value, event, type) => {
                                const str = value.trim();
                                setPesquisando(false);

                                setSearchQuery(str);
                            }}
                        />
                    </div>
                    <div className={styles.filtros}>
                        <div>
                            <label htmlFor="">Filtrar por:</label>
                            <select name="option" id="filtro-cliente" className={styles.slct} onChange={(e) => { setTipoFiltro(e.target.value) }}>
                                <option value="nome">Nome</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Ordenação:</label>
                            <select value={ordenacao} name="ordenacao" id="ordenacao-cliente" className={styles.slct} onChange={(e) => { setOrdenacao(e.target.value) }}>
                                <option value="ascending">Crescente</option>
                                <option value="descending">Decrescente</option>
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
                                            <img src={iconEditar} alt="" onClick={() => navEditarCliente(cliente)} />
                                        </div>
                                        <div className={styles.alinhamentoImage}>
                                            <img src={iconDeletar} alt="" onClick={() => {
                                                if (confirm('Deseja realmente deletar este cliente?')) {
                                                    deletarCliente(cliente.id);
                                                }
                                            }} />
                                        </div>
                                    </div>
                                    <div>
                                        <img src={seta} alt="" onClick={() => {
                                            setClientView(cliente)
                                            setShowInfo(true);
                                        }} />
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
                <Modal show={showInfo} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{clientView.nome}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={styles.estiloModal}>
                            <div className={styles.tele}>
                                <label htmlFor="">Telefone:</label>
                                <span>{clientView.telefone}</span>
                            </div>
                            <div>
                                <label htmlFor="">Serviço(s) Favorito(s):</label>
                                {clientView.servicoRequerido?.length > 0 ? (
                                    clientView.servicoRequerido.map((servico) => (
                                        <div key={servico.servico} className={styles.servicosFavority}>
                                            <span readOnly >{servico.nome}</span>
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
                    </Modal.Body>
                </Modal>
                // <div className={styles.infoModal}>
                //     <div className={styles.estiloModal}>
                //         <div className={styles.estiloTitulo}>
                //             <h2>{clientView.nome}</h2>
                //         </div>
                //         <div className={styles.quadro}>
                //             <div className={styles.tele}>
                //                 <label htmlFor="">Telefone:</label>
                //                 <span>{clientView.telefone}</span>
                //             </div>
                //             <div>
                //                 <label htmlFor="">Serviço(s) Favorito(s):</label>
                //                 {clientView.servicoRequerido?.length > 0 ? (
                //                     clientView.servicoRequerido.map((servico) => (
                //                         <div key={servico.servico} className={styles.servicosFavority}>
                //                             <span readOnly >{servico.nome}</span>
                //                         </div>
                //                     ))
                //                 ) : (
                //                     <div>
                //                         <span>Nenhum serviço favorito cadastrado</span>
                //                     </div>
                //                 )}
                //             </div>
                //             <div className={styles.estiloEndereco}>
                //                 <label htmlFor="">Endereço:</label>
                //                 <span>{
                //                     `${clientView.endereco.logradouro},
                //                     ${clientView.endereco.numero}, 
                //                     ${clientView.endereco.bairro}, 
                //                     ${clientView.endereco.cidade}-${clientView.endereco.estado}`}</span>
                //             </div>
                //         </div>
                //         <div className={styles.spanFechar}>
                //             <button className={styles.spanFechar} onClick={() => {setShowInfo(false)}}>Fechar</button>
                //         </div>
                //     </div>
                // </div>
            )}

        </div>
    )
}

export default ListarClientes;