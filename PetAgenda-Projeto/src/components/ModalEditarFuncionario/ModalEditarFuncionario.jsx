import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import styles from "./ModalEditarFuncionario.module.css"
import stylesCadastro from "../../pages/Funcionario/CadastroFuncionario/Cadastro_Funcionario.module.css";
import { useAuth } from "../../contexts/UserContext";
import { LoadingOutlined } from "@ant-design/icons";


const ModalEditarFuncionario = ({ isOpen, onClose, funcionario, setFuncionario, servicos, handleEditar }) => {
    const { validar } = useAuth();
    const [ isLoading, setIsLoading ] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
      } = useForm();

    const onSubmitEditar = async (data) => {
        const objFun = {
          id: funcionario.id,
          nome: data.nome,
          telefone: data.telefone,
          exerce: [
            {
              id: Number(data.servico),
            },
          ],
        };
    
        if (validar) {
            setIsLoading(true);
            handleEditar(objFun);
        }
      };
    if (!isOpen) return null;
    
    const onError = (errors) => {
        console.log("Erro ao Enviar", errors);
    };

    return(
        <div className={styles.beforeModal}>
            <div className={styles.cardModal}>
                <div className={styles.posicaoBotao}>
                    <button onClick={onClose} className={styles.botaoFechar}>X</button>
                </div>
                <div className={styles.onlyTitle}>
                    <h2>Editar Funcionário</h2>
                    <form
                    onSubmit={handleSubmit(onSubmitEditar, onError)}
                    className={stylesCadastro.customeForm}
                    >
                    <div className={stylesCadastro.areaNomeSexo}>
                        <div className={stylesCadastro.controlaCampos}>
                        <label>
                            Nome<span style={{ color: "red" }}>*</span>:
                        </label>
                        <input
                            type="text"
                            defaultValue={funcionario.nome}
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
                    <div className={stylesCadastro.controlaCampos}>
                        <label>
                        Serviço<span style={{ color: "red" }}>*</span>:
                        </label>
                        <select
                        defaultValue={funcionario.exerce[0].servico}
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
                    <div className={stylesCadastro.controlaCampos}>
                        <label>
                        Telefone<span style={{ color: "red" }}>*</span>:
                        </label>
                        <input
                        type="text"
                        defaultValue={funcionario.telefone}
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

                    <div className={stylesCadastro.posicaoBotaoForm}>
                        <button type="submit" disabled={isLoading}>Editar
                        {isLoading && <span style={{display: 'inline-block', marginLeft: '0.8em', verticalAlign: 'center'}}>
                            <LoadingOutlined />
                        </span>}
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ModalEditarFuncionario