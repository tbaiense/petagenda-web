import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ModalCadastroFuncionario from "../../../components/ModalFuncionario/ModalCadastroFuncionario";
import ModalEditarFuncionario from "../../../components/ModalEditarFuncionario/ModalEditarFuncionario";
import styles from "./Cadastro_Funcionario.module.css";
import Button from "react-bootstrap/Button";
const CadastroFuncionario = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  function popularListaFuncionarios() {
    // Pego os funcionarios do banco da empresa
    empresaFetch("/funcionario")
      .then((res) => res.json())
      .then((data) => {
        setFuncionarios(data.funcionarios);
      })
      .catch((error) => {
        console.error("Erro ao buscar Funcionarios:", error);
      });

    // Pego os funcionarios do banco da empresa
    empresaFetch("/servico-oferecido")
      .then((res) => res.json())
      .then((data) => {
        setServicos(data.servicosOferecidos);
      })
      .catch((error) => {
        console.error("Erro ao buscar serviços oferecidos:", error);
      });
  }

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
  
  useEffect(() => {
    if (validar) {
      popularListaFuncionarios();
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const onSubmit = async (data) => {
    const novoFuncionario = {
      id: funcionarios.length + 1,
      nome: data.nome,
      telefone: data.telefone,
      exerce: [{ servico: Number(data.servico) }],
    };

    setFuncionarios([...funcionarios, novoFuncionario]);
    alert("Funcionário cadastrado com sucesso!");
    reset();
    setShowModal(false);
  };

  const handleEditarClick = (funcionario) => {
    const dadosParaFormulario = {
      id: funcionario.id,
      nome: funcionario.nome,
      telefone: funcionario.telefone,
      servico: funcionario.exerce?.[0]?.servico || "",
    };

    setFuncionarioSelecionado(dadosParaFormulario);
    reset(dadosParaFormulario);
    setShowModalEditar(true);
  };

  const onSubmitEditar = async (data) => {
    const funcionarioEditado = {
      id: data.id,
      nome: data.nome,
      telefone: data.telefone,
      exerce: [{ servico: Number(data.servico) }],
    };

    setFuncionarios((prev) =>
      prev.map((func) =>
        func.id === funcionarioEditado.id ? funcionarioEditado : func
      )
    );
    alert("Funcionário editado com sucesso!");

    reset();
    setShowModalEditar(false);
  };

  const onError = (errors) => {
    console.log("Erro ao Enviar", errors);
  };

  return (
    <div className={styles.viewConteudo}>
      <h1>Funcionários Cadastrados</h1>
      <hr />

      <ModalCadastroFuncionario
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <h2>Cadastro de Funcionário</h2>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className={styles.customeForm}
        >
          <div className={styles.areaNomeSexo}>
            <input type="hidden" {...register("id")} />
            <div className={styles.controlaCampos}>
              <label>
                Nome<span style={{ color: "red" }}>*</span>:
              </label>
              <input
                type="text"
                placeholder="Digite o nome"
                {...register("nome", {
                  required: "O nome é obrigatório",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  maxLength: { value: 64, message: "Máximo 64 caracteres" },
                  onChange: (e) => {
                    let value = e.target.value;
                    value = value
                      .split(" ")
                      .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
                      .join(" ");
                    setValue("nome", value);
                  },
                })}
              />
              {errors.nome && (
                <p style={{ color: "red" }}>{errors.nome.message}</p>
              )}
            </div>
          </div>

          <div className={styles.controlaCampos}>
            <label>
              Serviço<span style={{ color: "red" }}>*</span>:
            </label>
            <select
              {...register("servico", {
                required: "Selecione um serviço",
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
            <label>
              Telefone<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="text"
              placeholder="Digite o telefone"
              {...register("telefone", {
                required: "O telefone é obrigatório",
                pattern: {
                  value: /^\d{2} \d{5}-\d{4}$/,
                  message: "Formato esperado: 27 99888-7766",
                },
                onChange: (e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  value = `${value.slice(0, 2)}${
                    value.length > 2 ? " " : ""
                  }${value.slice(2, 7)}${
                    value.length > 7 ? "-" : ""
                  }${value.slice(7, 11)}`;
                  setValue("telefone", value);
                },
              })}
            />
            {errors.telefone && (
              <p style={{ color: "red" }}>{errors.telefone.message}</p>
            )}
          </div>

          <div className={styles.posicaoBotaoForm}>
            <button type="submit">Cadastrar</button>
          </div>
        </form>
      </ModalCadastroFuncionario>

      <ModalEditarFuncionario
        isOpen={showModalEditar}
        onClose={() => setShowModalEditar(false)}
      >
        <h2>Editar Funcionário</h2>
        <form
          onSubmit={handleSubmit(onSubmitEditar, onError)}
          className={styles.customeForm}
        >
          <div className={styles.areaNomeSexo}>
            <div className={styles.controlaCampos}>
              <label>
                Nome<span style={{ color: "red" }}>*</span>:
              </label>
              <input
                type="text"
                placeholder="Digite o nome"
                {...register("nome", {
                  required: "O nome é obrigatório",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  maxLength: { value: 64, message: "Máximo 64 caracteres" },
                  onChange: (e) => {
                    let value = e.target.value;
                    value = value
                      .split(" ")
                      .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
                      .join(" ");
                    setValue("nome", value);
                  },
                })}
              />
              {errors.nome && (
                <p style={{ color: "red" }}>{errors.nome.message}</p>
              )}
            </div>
          </div>
          <div className={styles.controlaCampos}>
            <label>
              Serviço<span style={{ color: "red" }}>*</span>:
            </label>
            <select
              {...register("servico", {
                required: "Selecione um serviço",
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
            <label>
              Telefone<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="text"
              placeholder="Digite o telefone"
              {...register("telefone", {
                required: "O telefone é obrigatório",
                pattern: {
                  value: /^\d{2} \d{5}-\d{4}$/,
                  message: "Formato esperado: 27 99888-7766",
                },
                onChange: (e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  value = `${value.slice(0, 2)}${
                    value.length > 2 ? " " : ""
                  }${value.slice(2, 7)}${
                    value.length > 7 ? "-" : ""
                  }${value.slice(7, 11)}`;
                  setValue("telefone", value);
                },
              })}
            />
            {errors.telefone && (
              <p style={{ color: "red" }}>{errors.telefone.message}</p>
            )}
          </div>

          <div className={styles.posicaoBotaoForm}>
            <button type="submit">Editar</button>
          </div>
        </form>
      </ModalEditarFuncionario>

      <table className={styles.tabelaBonita}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Serviço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((func) => {
            const servico = servicos.find(
              (s) => s.id === func.exerce[0].servico
            );
            return (
              <tr key={func.id}>
                <td>{func.nome}</td>
                <td>{func.telefone}</td>
                <td>{servico?.nome || "Não informado"}</td>
                <td>
                  <Button onClick={() => handleEditarClick(func)}>
                    Editar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.estiloBotao}>
        <button onClick={() => setShowModal(true)}>Adicionar</button>
      </div>
    </div>
  );
};

export default CadastroFuncionario;
