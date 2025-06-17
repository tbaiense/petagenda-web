import styles from "./ListarPets.module.css"
import { useEffect, useState } from "react"
import { useAuth } from '../../contexts/UserContext';
import PetListaCard from "../../components/CardPet/PetListaCard";
import { Input } from 'antd';



const { Search } = Input;

const ListarPets = () => {
    const [showInfo, setShowInfo] = useState(false)
    const [pets, setPets] = useState([]);
    const [ petView, setPetView ] = useState({});
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ pesquisando, setPesquisando ] = useState(false);
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
                        <Search placeholder="Pesquise pelo pet..." enterButton="Search" size="large" loading={pesquisando} onChange={(e) => {setPesquisando(!pesquisando)}}/>                    
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
<<<<<<< HEAD
                        {/* {pets.map((pet) => {
                            return(
                                <div className={styles.miniCard}>

                                    {if(pet.sexo === Feminino){
                                        return (
                                            <div className={styles.female}>
                                                <img src={female} alt="" />
                                            </div>
                                        )
                                    }else{
                                        return (
                                            <div className={styles.male}>
                                                <img src={male} alt="" />
                                            </div>
                                        )
                                    }}

                                    <div className={styles.subInfo} key={pet}>
                                        <span className={styles.estiloNome}>{pet.nome}</span>
                                        <span className={styles.estiloEspecie}>{pet.especie}</span>
                                        <span className={styles.estiloDono}>{pet.dono}</span>
                                    </div>
                                
                                    <div>
                                        <button onClick={abrirModalInfo(pets,pets.id)} className={styles.bttn}><img src={seta} alt="seta" /></button>
                                    </div>

                                </div>
                            )
                        })} */}

                        <div className={styles.miniCard}>
                            <div className={styles.suporte}>
                                <div className={styles.male}>
                                    <img src={male} alt="" />
                                </div>

                                <div className={styles.subInfo}>
                                    <span className={styles.estiloNome}>Nome</span>
                                    <span className={styles.estiloEspecie}>Especie</span>
                                    <span className={styles.estiloDono}>De Dono</span>
                                </div>
                            </div>
                            

                            <div>
                                <button onClick={() => setShowInfo(true)} className={styles.bttn}><img src={seta} alt="seta" /></button>
                            </div>
                        </div>
=======
                        { pets && pets.map(p => {
                            return (
                                <PetListaCard key={p.id} pet={{nome: p.nome, sexo: p.sexo, especie: p.especie.nome, dono: p.dono.nome}} showInfo={() => {
                                    setPetView(p);
                                    setShowInfo(true);
                                }} />
                            );
                        })}
>>>>>>> a007361 (cria componente de listagem de pets)
                        
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
                                            <input type="text" defaultValue={petView.dono.nome} disabled />
                                        </div>

                                        <div className={styles.estiloCampos}> 
                                            <label htmlFor="">Pet:</label>
                                            <input type="text"  defaultValue={petView.nome} disabled />
                                        </div >

                                    </div>

                                    <div className={styles.orgLayoutCampos}>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Espécie:</label>
                                            <input type="text" defaultValue={petView.especie.nome} disabled/>
                                        </div>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Raça:</label>
                                            <input type="text"  defaultValue={petView.raca} disabled />
                                        </div>  

                                    </div>

                                    <div className={styles.orgLayoutCampos}>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Cor:</label>
                                            <input type="text" defaultValue={petView.cor} disabled/>
                                        </div>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Porte:</label>
                                            <input type="text" defaultValue={
                                                (() => {
                                                    let content;

                                                    switch (petView.porte) {
                                                        case 'P': {
                                                            content = 'Pequeno';
                                                            break;
                                                        }
                                                        case 'M': {
                                                            content = 'Médio';
                                                            break;
                                                        }
                                                        case 'G': {
                                                            content = "Grande";
                                                            break;
                                                        }
                                                        default: { content = "Indefinido" }
                                                    }

                                                    return content;
                                                })()
                                            } disabled/>
                                        </div> 

                                    </div>

                                    <div className={styles.orgLayoutCampos}>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Sexo:</label>
                                            <input type="text" defaultValue={(petView.sexo == 'M') ? "Macho": "Fêmea"} disabled/>
                                        </div>

                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Castrado:</label>
                                            <input type="text" defaultValue={(petView.eCastrado) ? "Sim" : "Não"} disabled/>
                                        </div>
{/* 
                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Nascido:</label>
                                            <input type="date" defaultValue={petView.} disabled/>
                                        </div> */}

                                    </div>

                                    <div className={styles.estiloCampos}>
                                        <label htmlFor="">Estado de Saúde:</label>
                                        <textarea htmlFor="" disabled defaultValue={petView.estadoSaude}></textarea>
                                    </div>
                                    <div className={styles.estiloCampos}>
                                        <label htmlFor="">Comportamento:</label>
                                        <textarea htmlFor="" disabled defaultValue={petView.comportamento}></textarea>
                                    </div>
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