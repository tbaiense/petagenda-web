
import { useEffect,useState } from "react"
import { useAuth } from "../../contexts/UserContext";
import CardCliente from "../../components/CardCliente/CardCliente"
import styles from "./ListarClientes.module.css"
import { useNavigate } from "react-router-dom";

const ListarClientes = () => {
    const { empresaFetch, validar } = useAuth();
    const [ clientes, setClientes] = useState([]);
    const navigate = useNavigate();

    function popularListaClientes() {
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

    useEffect(() => {
        if (validar) {
            popularListaClientes();
        }
    }, []);

    return(
        <div className={styles.viewConteudo}>
            <div>
                <h1>Clientes Cadastrados</h1>
                <hr />
                {/* Ao clicar em um "botão" abre um modal para cadastrar um novo cliente */}
                <div className={styles.estiloBotao}>
                    <button onClick={ () => { navigate('/empresa/clientes/cadastrar') }}>Adicionar</button>
                </div>
            </div>
            <div>
                <table className={styles.tabelaBonita}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes && clientes.map((cli) => {
                            return (
                                <tr key={cli.id}>
                                    <td>{cli.nome}</td>
                                    <td>{cli.telefone}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            

        </div>
    )
}

export default ListarClientes;