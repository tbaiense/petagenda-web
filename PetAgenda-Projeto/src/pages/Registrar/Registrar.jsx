import React, { useState } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import NavBarPetAgenda from "../../components/NavBarPetAgenda";
import "./Registrar.css";

function Registrar() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [erroConfirmacaoSenha, setErroConfirmacaoSenha] = useState("");
  const navigate = useNavigate();

  const etapas = [
    { id: 1, label: "Insira endereço de e-mail" },
    { id: 2, label: "Crie sua senha" },
    { id: 3, label: "Pergunta de segurança" },
  ];

  const onSubmit = (data) => {
    if (data.senha !== data.confirmarSenha) {
      setErroConfirmacaoSenha("As senhas não coincidem.");
      return;
    }

    if (etapaAtual < etapas.length) {
      setEtapaAtual(etapaAtual + 1);
    } else {
      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    }
  };

  const renderConteudo = () => (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {etapaAtual === 1 && (
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Digite seu e-mail"
            {...register("email", {
              required: "Este campo é obrigatório",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "E-mail inválido",
              },
            })}
          />
          {errors.email && (
            <span className="text-danger">{errors.email.message}</span>
          )}
        </Form.Group>
      )}

      {etapaAtual === 2 && (
        <>
          <Form.Group controlId="formSenha">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Digite sua senha"
              {...register("senha", {
                required: "Este campo é obrigatório",
                minLength: {
                  value: 6,
                  message: "A senha deve ter no mínimo 6 caracteres",
                },
              })}
            />
            {errors.senha && (
              <span className="text-danger">{errors.senha.message}</span>
            )}
          </Form.Group>

          <Form.Group controlId="formConfirmarSenha" className="mt-3">
            <Form.Label>Confirmar Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Digite novamente"
              {...register("confirmarSenha", {
                required: "Este campo é obrigatório",
              })}
            />
            {erroConfirmacaoSenha && (
              <span className="text-danger">{erroConfirmacaoSenha}</span>
            )}
          </Form.Group>
        </>
      )}

      {etapaAtual === 3 && (
        <>
          <Form.Group controlId="formPergunta">
            <Form.Label>Pergunta de segurança</Form.Label>
            <Form.Select
              {...register("pergunta", {
                required: "Este campo é obrigatório",
              })}
            >
              <option value="">Selecione uma pergunta</option>
              <option>Qual o nome do seu primeiro animal de estimação?</option>
              <option>Qual o nome da sua escola primária?</option>
              <option>Qual a cidade onde sua mãe nasceu?</option>
            </Form.Select>
            {errors.pergunta && (
              <span className="text-danger">{errors.pergunta.message}</span>
            )}
          </Form.Group>

          <Form.Group controlId="formResposta" className="mt-3">
            <Form.Label>Resposta</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite a resposta"
              {...register("resposta", {
                required: "Este campo é obrigatório",
              })}
            />
            {errors.resposta && (
              <span className="text-danger">{errors.resposta.message}</span>
            )}
          </Form.Group>
        </>
      )}

      <Button type="submit" className="btn__next">
        {etapaAtual === etapas.length ? "Cadastrar-se" : "Próximo"}
      </Button>
    </Form>
  );

  return (
    <div>
      <NavBarPetAgenda />
      <div className="tela__cadastro">
        <Container className="cadastro__container">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6} xl={5}>
              <div className="form__container">
                <div className="form__header">
                  <h1>Crie uma conta</h1>
                  <p>
                    Já tem uma conta? <a href="/login">Login</a>
                  </p>
                </div>

                <div className="form__progress">
                  {etapas.map((etapa) => (
                    <div className="progress__step" key={etapa.id}>
                      <div
                        className={`progress__circle ${
                          etapaAtual === etapa.id
                            ? "progress__circle--active"
                            : ""
                        }`}
                      >
                        {etapa.id}
                      </div>
                      <span
                        className={`progress__label ${
                          etapaAtual === etapa.id
                            ? "progress__label--active"
                            : ""
                        }`}
                      >
                        {etapa.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="form__content">{renderConteudo()}</div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Registrar;
