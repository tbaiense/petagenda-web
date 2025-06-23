import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/UserContext";
import ModalCadastroFuncionario from "../../../components/ModalFuncionario/ModalCadastroFuncionario";
import styles from "./Cadastro_Funcionario.module.css";
import ModalEditarFuncionario from "../../../components/ModalEditarFuncionario/ModalEditarFuncionario";
import { Input } from 'antd';
import iconEditar from "../../../assets/icon_editarAzul.svg"
import iconDeletar from "../../../assets/icon_delete.svg"

const { Search } = Input;

const CadastroFuncionario = () => {
  const { empresaFetch, validar } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [pesquisando, setPesquisando] = useState(false);


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
        method: 'DELETE',
      });

      if (response.ok) {
        setFuncionarios((prev) => prev.filter((funcionario) => funcionario.id !== id));
        console.log('Funcionario deletado com sucesso!');
      } else {
        console.error('Erro ao deletar funcionario');
      }
    } catch (error) {
      console.error('Erro ao deletar funcionario:', error);
    }
  }

  function popularListaFuncionarios() {
    empresaFetch("/funcionario")
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
  }, []);

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
      body: JSON.stringify(objFun)
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

  const onError = (errors) => {
    console.log("Erro ao Enviar", errors);
  };

  return (
    <div className={styles.viewConteudo}>
      <div>
        <h1>Funcionarios Cadastrados</h1>
        <hr />
      </div>
      <div className={styles.alinhamento} >
        <div className={styles.orgContent}>
          <div className={styles.pesquisa}>
            <Search placeholder="Pesquise pelo funcionario..." enterButton="Search" size="large" loading={pesquisando} onChange={(e) => { setPesquisando(!pesquisando) }} />
          </div>
          <div className={styles.filtros}>
            <div>
              <label htmlFor="">Filtrar por:</label>
              <select name="" id="" className={styles.slct}>
                <option value="">Nome</option>
              </select>
            </div>
            <div>
              <label htmlFor="">Ordenação:</label>
              <select name="" id="" className={styles.slct}>
                <option value="">Crescente</option>
                <option value="">Decrescente</option>
              </select>
            </div>
          </div>
          {funcionarios?.length > 0 ? (
            funcionarios?.map((funcionario) => {
              const servExerce = servicos.flatMap((serv) => {
                if (serv.id == func.exerce[0].servico) {
                  return serv.nome;
                } else {
                  return [];
                }
              })

              return (
                <div className={styles.listFuncionarioLimit}>
                  <div key={funcionario.id} className={styles.cardInfo}>
                    <div>
                      <span className={styles.nomeFuncionario}>{funcionario.nome}</span>
                      <div className={styles.layoutInfoPerson}>
                        <span>{funcionario.telefone}</span>
                        <span>|</span>
                        <span>{servExerce.length > 0 && servExerce[0]}</span>
                      </div>
                    </div>
                    <div className={styles.position}>
                      <div className={styles.position2}>
                        <div className={styles.alinhamentoImage}>
                          <img src={iconEditar} alt="" onClick={() => abrirModalEditar(funcionario)} />
                        </div>
                        <div className={styles.alinhamentoImage}>
                          <img src={iconDeletar} alt="" onClick={() => {
                            if (confirm('Deseja realmente deletar este cliente?')) {
                              deletarFuncionario(funcionario.id);
                            }
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className={styles.cardInfo}>
              <span>Nenhum serviço cadastrado</span>
            </div>
          )}
        </div>
      </div>

      {
        showModal &&
        <ModalCadastroFuncionario
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <h2>Cadastro de Funcionario</h2>

          <form
            id="form-func"
            action=""
            className={styles.customeForm}
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <div className={styles.areaNomeSexo}>
              <div className={styles.controlaCampos}>
                <label htmlFor="">
                  Nome<span style={{ color: "red" }}>*</span>:
                </label>
                <input
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
              </div>
            </div>

            <div>
              <div className={styles.controlaCampos}>
                <label htmlFor="">
                  Serviço Exercido<span style={{ color: "red" }}>*</span>:
                </label>
                <select
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
                </select>
                {errors.servico && (
                  <p style={{ color: "red" }}>{errors.servico.message}</p>
                )}
              </div>

              <div className={styles.controlaCampos}>
                <label htmlFor="">
                  Telefone<span style={{ color: "red" }}>*</span>:
                </label>
                <input
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
              </div>
            </div>

            <div className={styles.posicaoBotaoForm}>
              <button type="submit">Cadastrar</button>
            </div>
          </form>
        </ModalCadastroFuncionario>
      }
      {showModalEditar && funcionarioSelecionado &&
        <ModalEditarFuncionario
          funcionario={funcionarioSelecionado}
          setFuncionario={setFuncionarioSelecionado}
          handleEditar={editarFuncionario}
          isOpen={showModalEditar}
          servicos={servicos}
          onClose={() => setShowModalEditar(false)}
        />
      }
      <div>
        {/* <table className={styles.tabelaBonita}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Serviço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios &&
              funcionarios.map((func) => {
                const servExerce = servicos.flatMap((serv) => {
                  if (serv.id == func.exerce[0].servico) {
                    return serv.nome;
                  } else {
                    return [];
                  }
                });
                return (
                  <tr key={func.id}>
                    <td>{func.nome}</td>
                    <td>{func.telefone}</td>
                    <td>{servExerce.length > 0 && servExerce[0]}</td>
                    <td>
                      <button onClick={() => abrirModalEditar(func)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table> */}
      </div>

      {/* Ao clicar em um "botão" abre um modal para cadastrar um novo funcionario */}
      <div className={styles.estiloBotao}>
        <button onClick={() => setShowModal(true)}>Adicionar</button>
      </div>
    </div>
  );
};

export default CadastroFuncionario;
