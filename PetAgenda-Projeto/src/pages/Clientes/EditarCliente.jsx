import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import styles from "./EditarCliente.module.css";

const EditarCliente = () => {
  const { state } = useLocation();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (state) {
      setValue("nome", state.nome);
      setValue("telefone", state.telefone);
      setValue("cep", state.endereco.cep);
      setValue("logradouro", state.endereco.logradouro);
      setValue("numero", state.endereco.numero);
      setValue("bairro", state.endereco.bairro);
      setValue("cidade", state.endereco.cidade);
      setValue("estado", state.endereco.estado);
      console.log(state)
    }
  }, [state, setValue]);

  const onSubmit = (data) => {
    console.log("Dados enviados:", data);
    // Aqui você faz o fetch PUT/POST para atualizar no backend
  };

  const onError = (errors) => {
    console.log(errors);
  };

  return (
    <div>
      <div className={styles.tituloPage}>
        <h2>Editar dados de {state.nome}</h2>
        <hr />
      </div>

      <div className={styles.areaCadastro}>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className={styles.estiloForm}
        >
          <div className={styles.infoNomeTelefone}>
            <div className={styles.estiloCampos}>
              <label>Nome</label>
              <input
                type="text"
                {...register("nome", {
                  required: "O nome é obrigatório",
                  minLength: {
                    value: 10,
                    message: "O nome deve ter pelo menos 10 caracteres",
                  },
                  maxLength: {
                    value: 80,
                    message: "O nome deve ter no máximo 80 caracteres",
                  },
                  onChange: (e) => {
                    let value = e.target.value;
                    if (value) {
                      let values = value.split(" ");
                      values = values.map(
                        (v) =>
                          `${v.charAt(0).toUpperCase()}${v.substring(1)}`
                      );
                      value = values.join(" ");
                    }
                    setValue(e.target.name, value);
                  },
                })}
              />
              {errors.nome && (
                <p style={{ color: "red" }}>{errors.nome.message}</p>
              )}
            </div>

            <div className={styles.estiloCampos}>
              <label>Telefone</label>
              <input
                type="text"
                {...register("telefone", {
                  required: "O telefone é obrigatório",
                  pattern: {
                    value: /^\d{2} \d{5}-\d{4}$/,
                    message: "Formato esperado: 27 99888-7766",
                  },
                  onChange: (e) => {
                    let value = e.target.value;
                    if (value) {
                      value = value.replaceAll(/[^0-9]/g, "");
                      value = `${value.substring(0, 2)}${
                        value.length > 2 ? " " : ""
                      }${value.substring(2, 7)}${
                        value.length > 7 ? "-" : ""
                      }${value.substring(7, 11)}`;
                    }
                    setValue(e.target.name, value);
                  },
                })}
              />
              {errors.telefone && (
                <p style={{ color: "red" }}>{errors.telefone.message}</p>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div>
            <div className={styles.estiloTitulos}>
              <h3>Endereço</h3>
            </div>
            <hr />
            <div className={styles.estiloCampos}>
              <label>CEP</label>
              <input
                type="text"
                placeholder="12345678"
                {...register("cep", {
                  required: "O CEP é obrigatório",
                  pattern: {
                    value: /^\d{5}\d{3}$/,
                    message: "Formato esperado: 12345678",
                  },
                  onChange: (e) => {
                    let value = e.target.value;
                    if (value) {
                      value = value.replaceAll(/[^0-9]/g, "");
                      value = value.substring(0, 8);
                    }
                    setValue(e.target.name, value);
                  },
                })}
              />
              {errors.cep && (
                <p style={{ color: "red" }}>{errors.cep.message}</p>
              )}
            </div>

            {/* Demais campos do endereço */}
            <div className={styles.estiloCampos}>
              <label>Logradouro</label>
              <input {...register("logradouro", { required: true })} />
            </div>
            <div className={styles.estiloCampos}>
              <label>Número</label>
              <input {...register("numero", { required: true })} />
            </div>
            <div className={styles.estiloCampos}>
              <label>Bairro</label>
              <input {...register("bairro", { required: true })} />
            </div>
            <div className={styles.estiloCampos}>
              <label>Cidade</label>
              <input {...register("cidade", { required: true })} />
            </div>
            <div className={styles.estiloCampos}>
              <label>Estado</label>
              <input {...register("estado", { required: true })} />
            </div>
          </div>

          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
    </div>
  );
};

export default EditarCliente;
