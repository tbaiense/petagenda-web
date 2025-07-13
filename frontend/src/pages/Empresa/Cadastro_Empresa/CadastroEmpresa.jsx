import styles from "./CadastroEmpresa.module.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NavEmpresa from "../../../components/navegacaoEmpresa/NavEmpresa.jsx";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Alert } from "antd";
const CadastroEmpresa = () => {
  const [mensagemAlerta, setMensagemAlerta] = useState(null);
  const { setEmpresa, apiFetch, getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);

    const objEmp = {
      nomeFantasia: data.NomeFantasia,
      razaoSocial: data.RazaoSocial,
      cnpj: data.CNPJ,
      lema: data.Lema
    };

    const res = await apiFetch("/empresa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(objEmp),
    });

    const jsonBody = await res.json();
    setIsLoading(false);
    if (res.status == 200) {
      setEmpresa(jsonBody.empresa);

      setMensagemAlerta({
        tipo: "success",
        titulo: "Empresa cadastrada com sucesso!",
        descricao: "Redirecionando para a página de planos...",
      });

      setTimeout(() => {
        setMensagemAlerta(null);
      }, 2500);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      navigate("/empresa/planos");
    } else {
      setMensagemAlerta({
        tipo: "error",
        titulo: "Erro ao cadastrar empresa",
        descricao: "Ocorreu um erro ao cadastrar a empresa.",
      });
      setTimeout(() => {
        setMensagemAlerta(null);
      }, 3000);
    }
  };

  const onError = (errors) => {
    console.log("Erro ao Enviar:", errors);
  };

  return (
    <div>
      {mensagemAlerta && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: "fit-content",
            maxWidth: "90vw",
          }}
        >
          <Alert
            message={mensagemAlerta.titulo}
            description={mensagemAlerta.descricao}
            type={mensagemAlerta.tipo}
            showIcon
            style={{
              fontSize: "12px",
              padding: "8px 12px",
              lineHeight: "1.2",
            }}
          />
        </div>
      )}
      <NavEmpresa />
      <div className="container my-5"  style={{maxWidth: '45em'}}>
        <h2 className="text-center mb-4">Cadastro da Empresa</h2>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <form onSubmit={handleSubmit(onSubmit, onError)} className="p-4">
              <div className="mb-3">
                <label className="form-label">Nome Fantasia</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.NomeFantasia ? "is-invalid" : ""
                  }`}
                  {...register("NomeFantasia", {
                    required: "O nome fantasia é obrigatório",
                    minLength: {
                      value: 10,
                      message: "Deve ter pelo menos 10 caracteres",
                    },
                    maxLength: {
                      value: 80,
                      message: "Deve ter no máximo 80 caracteres",
                    },
                  })}
                />
                {errors.NomeFantasia && (
                  <div className="invalid-feedback">
                    {errors.NomeFantasia.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Razão Social</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.RazaoSocial ? "is-invalid" : ""
                  }`}
                  {...register("RazaoSocial", {
                    required: "A razão social é obrigatória",
                    minLength: {
                      value: 10,
                      message: "Deve ter pelo menos 10 caracteres",
                    },
                    maxLength: {
                      value: 80,
                      message: "Deve ter no máximo 80 caracteres",
                    },
                  })}
                />
                {errors.RazaoSocial && (
                  <div className="invalid-feedback">
                    {errors.RazaoSocial.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">CNPJ</label>
                <input
                  type="text"
                  className={`form-control ${errors.CNPJ ? "is-invalid" : ""}`}
                  {...register("CNPJ", {
                    required: "O CNPJ é obrigatório",
                    pattern: {
                      value: /^[0-9]{14}$/,
                      message: "O CNPJ deve conter exatamente 14 números",
                    },
                  })}
                />
                {errors.CNPJ && (
                  <div className="invalid-feedback">{errors.CNPJ.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Lema</label>
                <textarea
                  className={`form-control ${errors.Lema ? "is-invalid" : ""}`}
                  rows={3}
                  placeholder="Nosso lema é..."
                  {...register("Lema", {
                    minLength: {
                      value: 10,
                      message: "O lema deve ter pelo menos 10 caracteres",
                    },
                    maxLength: {
                      value: 150,
                      message: "O lema deve ter no máximo 150 caracteres",
                    },
                  })}
                />
                {errors.Lema && (
                  <div className="invalid-feedback">{errors.Lema.message}</div>
                )}
              </div>

              <div className="d-flex justify-content-center mt-4 gap-3">
                <Button
                  disabled={!!isLoading}
                  className={styles.botao__cadastrar}
                  type="submit"
                >
                  Cadastrar Empresa
                  {isLoading && (
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "0.8em",
                        verticalAlign: "center",
                      }}
                    >
                      <LoadingOutlined />
                    </span>
                  )}
                </Button>
                <Button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    reset();
                    setImagemURL(null);
                  }}
                >
                  Limpar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroEmpresa;
