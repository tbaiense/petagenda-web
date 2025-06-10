import styles from "./ListarPets.module.css"
import { useEffect, useState } from "react"

const ListarPets = () => {

    const [pets, setPets] = useState([])


    // async function obterPets() {
    //     try{
    //         const resPets = await empresaFetch('/pets');
            
    //         if (resPets.status == 200){
    //             const jsonBody = await resPets.json();

    //             if (!jsonBody.pets){
    //                 throw new Error(jsonBody.message)
    //             }

    //             if (!jsonBody.pets) {
    //                 throw new Error(jsonBody.message || 'Nenhum pet encontrado');
    //             }

    //             if (jsonBody.pets.length == 0) {
    //                 return [];
    //             } else {
    //                 return jsonBody.pets;
    //             }
    //         } else {
    //             throw new Error('requisição não retornou código 200');
    //         }
                    
    //     } catch(err) {
    //         err.message = "Falha ao obter pets cadastrados: " + err.message;
    //         throw err;
    //   // return [];
    //     }
    // }

    // // Pega os pets cadastrados para listar
    // useEffect(() => {
    //     obterPets()
    //     .then(petsList => {
    //         setPets(petsList);
    //     })
    //     .catch(err => {
    //         alert(err.message)
    //     })
    // }, [])

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
                            <select name="" id="">
                                <option value="">Nome</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="">Espécie:</label>
                            <select name="" id="">
                                <option value="">Todas</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="">Ordem:</label>
                            <select name="" id="">
                                <option value="">Crescente</option>
                                <option value="">Decrescente</option>
                            </select>
                        </div>

                        <div>
                            <button>Aplicar</button>
                        </div>
                    </div>

                    <div>
                        {pets.map((pet) => {
                            return(
                                <div className={styles.miniCard}>

                                    <div className={styles.subInfo} key={pet}>
                                        <span>{pet.nome}</span>
                                        <span>{pet.especie}</span>
                                        <span>{pet.dono}</span>
                                    </div>
                                
                                    <div className={styles.toModal}>
                                        <img src="" alt="seta" />
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListarPets