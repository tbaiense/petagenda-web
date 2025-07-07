import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/UserContext";
import ModalCadastroFuncionario from "../../../components/ModalFuncionario/ModalCadastroFuncionario";
import styles from "./Cadastro_Funcionario.module.css";
import ModalEditarFuncionario from "../../../components/ModalEditarFuncionario/ModalEditarFuncionario";
import { Input } from "antd";
import iconEditar from "../../../assets/icon_editarAzul.svg";
import iconDeletar from "../../../assets/icon_delete.svg";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { LoadingOutlined } from "@ant-design/icons";

const { Search } = Input;

const CadastroFuncionario = () => {
      const [ isLoading, setIsLoading ] = useState(false);
  const { empresaFetch, validar } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);

  const [pesquisando, setPesquisando] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ordenacao, setOrdenacao] = useState('ascending');
  const [tipoFiltro, setTipoFiltro] = useState('nome');
  const handleClose = () => setShowModal(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const abrirModalEditar = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setShowModalEditar(true);
  };
  async function deletarFuncionario(id) {
    try {
      const response = await empresaFetch(`/funcionario/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFuncionarios((prev) =>
          prev.filter((funcionario) => funcionario.id !== id)
        );
        console.log("Funcionario deletado com sucesso!");
      } else {
        console.error("Erro ao deletar funcionario");
      }
    } catch (error) {
      console.error("Erro ao deletar funcionario:", error);
    }
  }

  function popularListaFuncionarios() {
    setPesquisando(true);
    empresaFetch(`/funcionario?query=${searchQuery}&option=${tipoFiltro}&ordenacao=${ordenacao}`)
      .then((res) => res.json())
      .then((data) => {
        setFuncionarios(data.funcionarios);
      })
      .catch((error) => {
        console.error("Erro ao buscar Funcionarios:", error);
      });

    empresaFetch("/servico-oferecido")
      .then((res) => res.json())
      .then((data) => {
        setServicos(data.servicosOferecidos);
      })
      .catch((error) => {
        console.error("Erro ao buscar serviços oferecidos:", error);
      });
  }

  useEffect(() => {
    if (validar) {
      popularListaFuncionarios();
    }
  }, [searchQuery]);

  function cadastrarFuncionario(objFun) {
    empresaFetch("/funcionario", {
      method: "POST",
      body: JSON.stringify(objFun),
    }).then(async (res) => {
      if (res.status == 200) {
        const json = await res.json();
        popularListaFuncionarios();
        alert(json.message);
      } else {
        alert("erro ao cadastrar funcionario");
      }
      reset();
      setShowModal(false);
    });
  }

  async function editarFuncionario(objFun) {
    const res = await empresaFetch(`/funcionario/${objFun.id}`, {
      method: "PUT",
      body: JSON.stringify(objFun),
    });

    if (res.status === 200) {
      reset();
      setShowModalEditar(false);
      popularListaFuncionarios();

      const json = await res.json();
      alert(json.message);
    } else {
      const json = await res.json();
      alert("Erro ao editar funcionário:\n" + json?.message);
    }
  }

  const onSubmit = async (data) => {
    const objFun = {
      nome: data.nome,
      telefone: data.telefone,
      exerce: [
        {
          id: Number(data.servico),
        },
      ],
    };

    if (validar) {
      cadastrarFuncionario(objFun);
    }
  };

  useEffect(() => {
    setPesquisando(false);
  }, [funcionarios]);

  const onError = (errors) => {
    console.log("Erro ao Enviar", errors);
  };

  return (
    <div className={styles.viewConteudo}>
      <div>
        <h1>Funcionários Cadastrados</h1>
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
            <div className={styles.estiloGap}>
              <label htmlFor="">Ordenação:</label>
              <select value={ordenacao} name="ordenacao" id="ordenacao-cliente" className={styles.slct} onChange={(e) => { setOrdenacao(e.target.value) }}>
                <option value="ascending">Crescente</option>
                <option value="descending">Decrescente</option>
              </select>
            </div>
          </div>
          <div className={styles.listaDeFuncionario}>
            {funcionarios?.length > 0 ? (
              funcionarios?.map((funcionario) => {
                const servExerce = servicos.flatMap((serv) => {
                  if (serv.id == funcionario.exerce[0].servico) {
                    return serv.nome
                  } else {
                    return [];
                  }
                });

                return (
                  <div key={funcionario.id} className={styles.listFuncionarioLimit}>
                    <div className={styles.cardInfo}>
                      <div>
                        <span className={styles.nomeFuncionario}>
                          {funcionario.nome}
                        </span>
                        <div className={styles.layoutInfoPerson}>
                          <span>{funcionario.telefone}</span>
                          <span>|</span>
                          <span>{servExerce.length > 0 && servExerce[0]}</span>
                        </div>
                      </div>
                      <div className={styles.position}>
                        <div className={styles.position2}>
                          <div className={styles.alinhamentoImage}>
                            <img
                              src={iconEditar}
                              alt=""
                              onClick={() => abrirModalEditar(funcionario)}
                            />
                          </div>
                          <div className={styles.alinhamentoImage}>
                            <img
                              src={iconDeletar}
                              alt=""
                              onClick={() => {
                                if (
                                  confirm(
                                    "Deseja realmente deletar este cliente?"
                                  )
                                ) {
                                  deletarFuncionario(funcionario.id);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.cardInfo}>
                <span>Nenhum funcionario cadastrado</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Cadastro de Funcionario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              id="form-func"
              action=""
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <Form.Group className="mb-3">
                <Form.Label htmlFor="">
                  Nome<span style={{ color: "red" }}>*</span>:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome"
                  {...register("nome", {
                    required: {
                      value: true,
                      message: "O nome é obrigatorio",
                    },
                    onChange: (e) => {
                      let value = e.target.value;

                      if (value && value.length > 0) {
                        let values = value.split(" ");
                        values = values.map(
                          (v) => `${v.charAt(0).toUpperCase()}${v.substring(1)}`
                        );
                        value = values.join(" ");
                      }
                      setValue(e.target.name, value);
                    },
                    minLength: {
                      value: 3,
                      message: "O nome deve ter pelo menos 3 caracteres",
                    },
                    maxLength: {
                      value: 64,
                      message: "O nome dever ter no maximo 64 caracteres",
                    },
                  })}
                />
                {errors.nome && (
                  <p style={{ color: "red" }}>{errors.nome.message}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Serviço Exercido<span style={{ color: "red" }}>*</span>:
                </Form.Label>
                <Form.Select
                  {...register("servico", {
                    required: {
                      value: true,
                      message: "Selecione um serviço exercido",
                    },
                  })}
                >
                  <option value="">Selecione um serviço</option>

                  {servicos.map((servico) => (
                    <option key={servico.id} value={servico.id}>
                      {servico.nome}
                    </option>
                  ))}
                </Form.Select>
                {errors.servico && (
                  <p style={{ color: "red" }}>{errors.servico.message}</p>
                )}
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>
                  Telefone<span style={{ color: "red" }}>*</span>:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o telefone"
                  {...register("telefone", {
                    required: {
                      value: true,
                      message: "O telefone é obrigatorio",
                    },
                    pattern: {
                      value: /^\d{2,2} \d{5,5}-\d{4,4}$/,
                      message: "Formato esperado: 27 99888-7766",
                    },
                    onChange: (e) => {
                      let value = e.target.value;

                      if (value && value.length > 0) {
                        value = value.replaceAll(/[^0-9]/g, "");
                        value = `${value.substring(0, 2)}${value.length > 2 ? " " : ""
                          }${value.substring(2, 7)}${value.length > 7 ? "-" : ""
                          }${value.substring(7, 11)}`;
                        console.log("limpei");
                      }
                      setValue(e.target.name, value);
                    },
                    minLength: {
                      value: 13,
                      message: "O telefone deve ter pelo menos 13 caracteres",
                    },
                    maxLength: {
                      value: 14,
                      message: "O telefone dever ter no maximo 15 caracteres",
                    },
                  })}
                />
                {errors.telefone && (
                  <p style={{ color: "red" }}>{errors.telefone.message}</p>
                )}
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button type="submit" >Cadastrar
                  {isLoading && <span style={{ display: 'inline-block', marginLeft: '0.8em', verticalAlign: 'center' }}>
                    <LoadingOutlined />
                    </span>}
                  </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
      {showModalEditar && funcionarioSelecionado && (
        <ModalEditarFuncionario
          funcionario={funcionarioSelecionado}
          setFuncionario={setFuncionarioSelecionado}
          handleEditar={editarFuncionario}
          isOpen={showModalEditar}
          servicos={servicos}
          onClose={() => setShowModalEditar(false)}
        />
      )}

      {/* Ao clicar em um "botão" abre um modal para cadastrar um novo funcionario */}
      <div className={styles.estiloBotao}>
        <button onClick={() => setShowModal(true)}>Adicionar</button>
      </div>
    </div>
  );
};

export default CadastroFuncionario;
