import styles from "./ListarPets.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import PetListaCard from "../../components/CardPet/PetListaCard";
import { Input } from "antd";

const { Search } = Input;

const ListarPets = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [pets, setPets] = useState([]);
  const [petView, setPetView] = useState({});

  const [ searchQuery, setSearchQuery] = useState("");
  const [ pesquisando, setPesquisando ] = useState(false);
  const [ ordenacao, setOrdenacao ] = useState('ascending');
  const [ tipoFiltro, setTipoFiltro ] = useState('nome');
  const [ especie , setEspecie ] = useState('');
  const [ especiesDisponiveis, setEspeciesDisponiveis ] = useState([]);

  const { empresaFetch, validar } = useAuth();

  // Obter espécies
  async function getEspeciesPet() {
    let errMsg;
    try {
      const fetchOpts = { method: "GET" };

      const response = await empresaFetch("/pet/especie", fetchOpts);

      const jsonBody = await response.json();

      if (response.status == 200) {
        if (jsonBody.especiesPet?.length > 0) {
          setEspeciesDisponiveis(jsonBody.especiesPet);
        }
        return;
      } else {
        if (jsonBody?.errors) {
          errMsg = jsonBody.errors.join("\n");
        } else {
          errMsg = "Erro desconhecido";
        }
        throw new Error(errMsg);
      }
    } catch (err) {
      alert("Falha ao obter espécies de pet:\n" + err.message);
    }
  }

  async function obterPets() {
    try {
      setPesquisando(true);
      const resPets = await empresaFetch(`/pet?query=${searchQuery}&option=${tipoFiltro}&ordenacao=${ordenacao}&especie=${especie}`);

      const jsonBody = await resPets.json();
      return jsonBody.pets;
    } catch (err) {
      err.message = "Falha ao obter pets cadastrados: " + err.message;
      throw err;
    }
  }

  async function popularPets() {
    const petsObtidos = await obterPets();
    setPets(petsObtidos);
  }

  useEffect(() => {
    getEspeciesPet();
  }, []);

  useEffect(() => {
    popularPets();
  }, [searchQuery]);

  useEffect(() => {
    if (validar) {
      setPesquisando(false);
    }
  }, [ pets ]);

  return (
    <div className={styles.viewConteudo}>
      <div className={styles.layoutLista}>
        <h1>Lista de Pets</h1>
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
              }}s
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
                <select name="option" id="filtro-cliente" className={styles.slct} onChange={(e) => {setTipoFiltro(e.target.value)}}>
                    <option value="nome">Nome</option>
                </select>
            </div>
            <div>
                <label htmlFor="">Ordenação:</label>
                <select value={ordenacao} name="ordenacao" id="ordenacao-cliente" className={styles.slct} onChange={(e) => {setOrdenacao(e.target.value)}}>
                    <option value="ascending">Crescente</option>
                    <option value="descending">Decrescente</option>
                </select>
            </div>

            <div>
              <label htmlFor="">Espécie:</label>
              <select name="" id="" className={styles.slct} value={especie} onChange={(e) => setEspecie(e.target.value)}>
                <option value="">Todas</option>
                { especiesDisponiveis?.length > 0 &&
                    especiesDisponiveis.map((e) => (
                      <option key={e.id} value={e.id}>{e.nome}</option>
                    ))
                }
              </select>
            </div>
          </div>

          <div>
            {pets?.length > 0 ? (
              pets && pets.map((p) => {
                return (
                  <PetListaCard
                    key={p.id}
                    pet={{
                      id: p.id,
                      nome: p.nome,
                      sexo: p.sexo,
                      especie: p.especie.nome,
                      dono: p.dono.nome,
                    }}
                    showInfo={() => {
                      setPetView(p);
                      setShowInfo(true);
                    }}
                  />
                );
              })
            ) : (
              <div className={styles.cardInfo}>
                <span>Nenhum Pet Cadastrado</span>
              </div>
            )}

            {showInfo && (
              <div className={styles.infoModal}>
                <div className={styles.spanFechar}>
                  <span onClick={() => setShowInfo(false)}>X</span>
                </div>
                <div className={styles.estiloModal}>
                  <div>
                    <h2>Ficha do Pet</h2>
                  </div>

                  <div className={styles.orgLayoutCampos}>
                    <div className={styles.estiloCampos}>
                      <label htmlFor="">Dono:</label>
                      <input
                        type="text"
                        defaultValue={petView.dono.nome}
                        disabled
                      />
                    </div>

                    <div className={styles.estiloCampos}>
                      <label htmlFor="">Pet:</label>
                      <input type="text" defaultValue={petView.nome} disabled />
                    </div>
                  </div>

                  <div className={styles.orgLayoutCampos}>
                    <div className={styles.estiloCampos}>
                      <label htmlFor="">Espécie:</label>
                      <input
                        type="text"
                        defaultValue={petView.especie.nome}
                        disabled
                      />
                    </div>

                    <div className={styles.estiloCampos}>
                      <label htmlFor="">Raça:</label>
                      <input type="text" defaultValue={petView.raca} disabled />
                    </div>
                  </div>

                  <div className={styles.orgLayoutCampos}>
                    <div className={styles.estiloCampos}>
                      <label htmlFor="">Cor:</label>
                      <input type="text" defaultValue={petView.cor} disabled />
                    </div>

                    <div className={styles.estiloCampos}>
                      <label htmlFor="">Porte:</label>
                      <input
                        type="text"
                        defaultValue={(() => {
                          let content;

                          switch (petView.porte) {
                            case "P": {
                              content = "Pequeno";
                              break;
                            }
                            case "M": {
                              content = "Médio";
                              break;
                            }
                            case "G": {
                              content = "Grande";
                              break;
                            }
                            default: {
                              content = "Indefinido";
                            }
                          }

                          return content;
                        })()}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.orgLayoutCampos}>
                    <div className={styles.estiloCampos}>
                      <label htmlFor="">Sexo:</label>
                      <input
                        type="text"
                        defaultValue={petView.sexo == "M" ? "Macho" : "Fêmea"}
                        disabled
                      />
                    </div>

                    <div className={styles.estiloCampos}>
                      <label htmlFor="">Castrado:</label>
                      <input
                        type="text"
                        defaultValue={petView.eCastrado ? "Sim" : "Não"}
                        disabled
                      />
                    </div>
                    {/* 
                                        <div className={styles.estiloCampos}>
                                            <label htmlFor="">Nascido:</label>
                                            <input type="date" defaultValue={petView.} disabled/>
                                        </div> */}
                  </div>

                  <div className={styles.estiloCampos}>
                    <label htmlFor="">Estado de Saúde:</label>
                    <textarea
                      htmlFor=""
                      disabled
                      defaultValue={petView.estadoSaude}
                    ></textarea>
                  </div>
                  <div className={styles.estiloCampos}>
                    <label htmlFor="">Comportamento:</label>
                    <textarea
                      htmlFor=""
                      disabled
                      defaultValue={petView.comportamento}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListarPets;
