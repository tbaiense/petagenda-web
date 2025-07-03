import styles from "./ListarPets.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import PetListaCard from "../../components/CardPet/PetListaCard";
import { Input } from "antd";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const { Search } = Input;

const ListarPets = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [pets, setPets] = useState([]);
  const [petView, setPetView] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [pesquisando, setPesquisando] = useState(false);
  const [ordenacao, setOrdenacao] = useState('ascending');
  const [tipoFiltro, setTipoFiltro] = useState('nome');
  const [especie, setEspecie] = useState('');
  const [especiesDisponiveis, setEspeciesDisponiveis] = useState([]);

  const { empresaFetch, validar } = useAuth();
  const handleClose = () => setShowInfo(false);

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
  }, [pets]);

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
              }}
              onSearch={(value, event, type) => {
                const str = value.trim();
                setPesquisando(false);

                setSearchQuery(str);
              }}
            />
          </div>
          <div className={styles.filtros}>
            <div className={styles.estiloGap}>
              <label htmlFor="">Filtrar por:</label>
              <select name="option" id="filtro-cliente" className={styles.slct} onChange={(e) => { setTipoFiltro(e.target.value) }}>
                <option value="nome">Nome</option>
              </select>
            </div>
            <div className={styles.estiloGap} >
              <label htmlFor="">Ordenação:</label>
              <select value={ordenacao} name="ordenacao" id="ordenacao-cliente" className={styles.slct} onChange={(e) => { setOrdenacao(e.target.value) }}>
                <option value="ascending">Crescente</option>
                <option value="descending">Decrescente</option>
              </select>
            </div>

            <div className={styles.estiloGap}>
              <label htmlFor="">Espécie:</label>
              <select name="" id="" className={styles.slct} value={especie} onChange={(e) => setEspecie(e.target.value)}>
                <option value="">Todas</option>
                {especiesDisponiveis?.length > 0 &&
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
              <Modal show={showInfo} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>{petView.nome}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className={styles.__espaco__}>
                    <div className={styles.__estilo_pequeno__}>
                      <label className={styles.__estilo_bold__}>Dono(a): </label>
                      <label htmlFor="">{petView.dono.nome}</label>
                    </div>
                    <div className={styles.espaco_entre_divs}>
                      <div className={styles.__estilo_pequeno__}>
                        <label htmlFor="" className={styles.__estilo_bold__}>Espécie:</label>
                        <label htmlFor="">{petView.especie.nome}</label>
                      </div>
                      <div className={styles.__estilo_pequeno__}>
                        <label htmlFor="" className={styles.__estilo_bold__}>Raça:</label>
                        <label htmlFor="">{petView.raca}</label>
                      </div>
                      <div className={styles.__estilo_pequeno__}>
                        <label htmlFor="" className={styles.__estilo_bold__}>Porte:</label>
                        <label >{content}</label>
                      </div>
                    </div>
                    <div className={styles.espaco_entre_divs}>
                      <div className={styles.__estilo_pequeno__}>
                        <label htmlFor="" className={styles.__estilo_bold__}>Cor:</label>
                        <label >{petView.cor}</label>
                      </div>
                      <div className={styles.__estilo_pequeno__}>
                        <label htmlFor="" className={styles.__estilo_bold__}>Castrado:</label>
                        <label htmlFor="">{petView.eCastrado ? "Sim" : "Não"}</label>
                      </div>
                      <div className={styles.__estilo_pequeno__}>
                        <label htmlFor="" className={styles.__estilo_bold__}>Sexo:</label>
                        <label htmlFor="">{petView.sexo == "M" ? "Macho" : "Fêmea"}</label>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="" className={styles.__estilo_bold__}>Estado da Saúde:</label>
                      <p>{petView.estadoSaude ? petView.estadoSaude : "Nada Declarado"}</p>
                    </div>
                    <div>
                      <label htmlFor="" className={styles.__estilo_bold__}>Comportamento:</label>
                      <p>{petView.comportamento}</p>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListarPets;
