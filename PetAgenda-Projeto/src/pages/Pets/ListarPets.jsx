import styles from "./ListarPets.module.css"
import { useEffect, useState } from "react"
import { useAuth } from '../../contexts/UserContext';4
import seta from '../../assets/icon_seta.svg'
import male from '../../assets/icon_male.svg'


const ListarPets = () => {
    const [showInfo, setShowInfo] = useState(false)
    const [pets, setPets] = useState([])


    async function obterPets() {
        try{
            const resPets = await empresaFetch('/pets');
            
            if (resPets.status == 200){
                const jsonBody = await resPets.json();

                if (!jsonBody.pets){
                    throw new Error(jsonBody.message)
                }

                if (!jsonBody.pets) {
                    throw new Error(jsonBody.message || 'Nenhum pet encontrado');
                }

                if (jsonBody.pets.length == 0) {
                    return [];
                } else {
                    return jsonBody.pets;
                }
            } else {
                throw new Error('requisição não retornou código 200');
            }
                    
        } catch(err) {
            err.message = "Falha ao obter pets cadastrados: " + err.message;
            throw err;
      // return [];
        }
    }

    // Pega os pets cadastrados para listar
    useEffect(() => {
        obterPets()
        .then(petsList => {
            setPets(petsList);
        })
        .catch(err => {
            alert(err.message)
        })
        // Função para filtrar por nome 
        async function filtroNome(query) {
            
        }
    
        // Função para filtrar por especie
        async function filtroEspecie(query) {
            
        }

        // Função para ?ordenar? por crescente e decrescente
        async function filtroOrdem(query) {
            
        }

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
                        {/* {pets.map((pet) => {
                            return(
                                <div className={styles.miniCard}>

                                    <div className={styles.subInfo} key={pet}>
                                        <span className={styles.estiloNome}>{pet.nome}</span>
                                        <span className={styles.estiloEspecie}>{pet.especie}</span>
                                        <span className={styles.estiloDono}>{pet.dono}</span>
                                    </div>
                                
                                    <div className={styles.toModal}>
                                        <img src="" alt="seta" />
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