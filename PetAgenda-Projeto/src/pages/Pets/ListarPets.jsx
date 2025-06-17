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

                        <div>
                            <label htmlFor="">Ordem:</label>
                            <select name="" id="" className={styles.slct}>
                                <option value="">Crescente</option>
                                <option value="">Decrescente</option>
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

                                <div>

                                    <div className={styles.orgLayoutCampos}>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Dono:</label>
                                            <label htmlFor="">(nome_do_dono)</label>
                                        </div>

                                        <div className={styles.estiloCampos}> 
                                            <label htmlFor="">Pet:</label>
                                            <label htmlFor="">(nome_do_pet)</label>
                                        </div >

                                    </div>

                                    <div className={styles.orgLayoutCampos}>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Espécie:</label>
                                            <label htmlFor="">(Espécie)</label>
                                        </div>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Raça:</label>
                                            <label htmlFor="">(Raça)</label>
                                        </div>  

                                    </div>

                                    <div className={styles.orgLayout}>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Cor:</label>
                                            <label htmlFor="">(Cor)</label>
                                        </div>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Porte:</label>
                                            <label htmlFor="">(Porte)</label>
                                        </div> 

                                    </div>

                                    <div className={styles.orgLayout}>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Sexo:</label>
                                            <label htmlFor="">(Sexo)</label>
                                        </div>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Castrado:</label>
                                            <label htmlFor="">(sim ou não)</label>
                                        </div>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Data de nascimento:</label>
                                            <label htmlFor="">(Data de nascimento)</label>
                                        </div>

                                    </div>

                                    <div className={styles.estiloCampos}>
                                        <label htmlFor="">Estado de Saúde:</label>
                                        <textarea htmlFor="">(Estado de Saúde)</textarea>
                                    </div>
                                    <div className={styles.estiloCampos}>
                                        <label htmlFor="">Comportamento:</label>
                                        <textarea htmlFor="">(Comportamento)</textarea>
                                    </div>

                                    <button onClick={() => setShowInfo(false)}>fechar</button>
                                </div>
                            </div>
                            
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListarPets