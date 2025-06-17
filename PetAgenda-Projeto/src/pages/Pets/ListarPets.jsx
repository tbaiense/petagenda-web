import styles from "./ListarPets.module.css"
import { useEffect, useState } from "react"
import { useAuth } from '../../contexts/UserContext';
import PetListaCard from "../../components/CardPet/PetListaCard";

const ListarPets = () => {
    const [showInfo, setShowInfo] = useState(false)
    const [pets, setPets] = useState([])
    const { empresaFetch } = useAuth();

    async function obterPets() {
        try{
            const resPets = await empresaFetch('/pet');
            
            const jsonBody = await resPets.json();
            return jsonBody.pets;
        } catch(err) {
            err.message = "Falha ao obter pets cadastrados: " + err.message;
            throw err;
        }
    }

    async function popularPets() {
        const petsObtidos = await obterPets();
        setPets(petsObtidos);
    }

    // Pega os pets cadastrados para listar
    useEffect(() => {
        popularPets();
    }, [])

    return(
        <div className={styles.viewConteudo}>

            <div className={styles.layoutLista}>
                <h1>Lista de Pets</h1>
                <hr />
            </div>

            <div className={styles.alinhamento}>

                <div className={styles.orgContent}>
                    {/* Pesquisa */}
                    <div className={styles.pesquisa}>
                        <input type="text" placeholder="Pesquisa pelo Pet..."/>
                    </div>
                    
                    {/* Filtros */}
                    <div className={styles.filtros}>
                        <div>
                            <label htmlFor="">Ordem:</label>
                            <select name="" id="" className={styles.slct}>
                                <option value="">Crescente</option>
                                <option value="">Decrescente</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Filtrar por:</label>
                            <select name="" id="" className={styles.slct}>
                                <option value="">Nome</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="">Espécie:</label>
                            <select name="" id="" className={styles.slct}>
                                <option value="">Todas</option>
                            </select>
                        </div>

                    </div>

                    <div>
                        { pets && pets.map(p => {
                            return (
                                <PetListaCard nome={p.nome} sexo={p.sexo} dono={p.dono.nome} especie={p.especie.nome} />
                            );
                        })}
                        
                        {showInfo && (
                            <div className={styles.infoModal}>
                                <div className={styles.spanFechar}>
                                    <span onClick={() => setShowInfo(false)} >X</span> 
                                </div>
                                <div className={styles.estiloModal}>
                                    <div>
                                        <h2>Ficha do Pet</h2>
                                    </div>

                                    <div className={styles.orgLayoutCampos}>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Dono:</label>
                                            <input type="text" value="nome do dono" disabled />
                                        </div>

                                        <div className={styles.estiloCampos}> 
                                            <label htmlFor="">Pet:</label>
                                            <input type="text" value="nome do pet" disabled />
                                        </div >

                                    </div>

                                    <div className={styles.orgLayoutCampos}>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Espécie:</label>
                                            <input type="text" value="Espécie" disabled/>
                                        </div>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Raça:</label>
                                            <input type="text" value="Raça" disabled />
                                        </div>  

                                    </div>

                                    <div className={styles.orgLayoutCampos}>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Cor:</label>
                                            <input type="text" value="Cor" disabled/>
                                        </div>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Porte:</label>
                                            <input type="text" value="Porte" disabled/>
                                        </div> 

                                    </div>

                                    <div className={styles.orgLayoutCampos}>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Sexo:</label>
                                            <input type="text" value="Sexo" disabled/>
                                        </div>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Castrado:</label>
                                            <input type="text" value="Sim ou não " disabled/>
                                        </div>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Nascido:</label>
                                            <input type="date" value="" disabled/>
                                        </div>

                                    </div>

                                    <div className={styles.estiloCampos}>
                                        <label htmlFor="">Estado de Saúde:</label>
                                        <textarea htmlFor="" disabled>(Estado de Saúde)</textarea>
                                    </div>
                                    <div className={styles.estiloCampos}>
                                        <label htmlFor="">Comportamento:</label>
                                        <textarea htmlFor="" disabled>(Comportamento)</textarea>
                                    </div>
                                </div>
                            </div>  
                        )}
                        <p>falta fazer as funções:</p>
                        <ul>
                            <li>pegar a query da barra de pesquisa e mandar para o backend</li>
                            <li>Pegar todas as espécies e popular o o filtro de espécie</li>
                            <li>aplicar as ordens</li>
                            <li>logica de passar o id do pet clicado para pegar as informações</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListarPets