import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./Registrar.css";
import { useAuth } from "../../contexts/UserContext";
import NavBarPetAgenda from "../../components/NavBar/NavBarPetAgenda";
import { LoadingOutlined } from "@ant-design/icons";


function Registrar() {
  const navigate = useNavigate();
  const { apiFetch } = useAuth();
  const [ isLoading, setIsLoading ] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(1);
  const etapas = [
    { id: 1, label: "Insira endereço de e-mail" },
    { id: 2, label: "Crie sua senha" },
    { id: 3, label: "Pergunta de segurança" },
  ];

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    getValues
  } = useForm();

  const senha = watch("senha");

  useEffect(() => {
    console.log(etapaAtual);
  }, [etapaAtual]);

  const cadastrarUsuario = async () => {

    const data = getValues();

    if (etapaAtual < 3) {
      return;
    }
    setIsLoading(true);
    const usuario = {
      email: data.email,
      senha: data.senha,
      perguntaSeguranca: {
        pergunta: data.pergunta,
        resposta: data.resposta,
      },
    };

    try {
      const response = await apiFetch("/usuario", {
        method: "POST",
        body: JSON.stringify(usuario),
      });

      const body = await response.json();

      if (body?.success) {
        setIsLoading(false);
        alert("Cadastro realizado com sucesso!");
        navigate("/login");
      } else {
        alert(
          "Erro no cadastro: " +
            (body?.errors?.[0]?.message || "Erro desconhecido")
        );
        setEtapaAtual(1);
      }
    } catch (error) {
      alert("Erro de conexão. Tente novamente.");
    }
    setIsLoading(false);
  };

  const onNext = async () => {
    if (etapaAtual < 3) {
      let camposValidar = [];
  
      if (etapaAtual === 1) camposValidar = ["email"];
      else if (etapaAtual === 2) camposValidar = ["senha", "confirmarSenha"];
      else if (etapaAtual === 3) camposValidar = ["pergunta", "resposta"];
  
      const valido = await trigger(camposValidar);
      if (valido) setEtapaAtual(etapaAtual + 1);
    }
  };

  const renderConteudo = () => (
    <>
      {etapaAtual === 1 && (
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Digite seu e-mail"
            {...register("email", {
              required: "Email é obrigatório",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email inválido",
              },
            })}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
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
                required: "Senha é obrigatória",
                minLength: {
                  value: 6,
                  message: "A senha deve ter no mínimo 6 caracteres",
                },
              })}
              isInvalid={!!errors.senha}
            />
            <Form.Control.Feedback type="invalid">
              {errors.senha?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formConfirmarSenha" className="mt-3">
            <Form.Label>Confirmar Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Digite novamente"
              {...register("confirmarSenha", {
                required: "Confirmação de senha é obrigatória",
                validate: (value) =>
                  value === senha || "As senhas não coincidem",
              })}
              isInvalid={!!errors.confirmarSenha}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmarSenha?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </>
      )}

      {etapaAtual === 3 && (
        <>
          <Form.Group controlId="formPergunta">
            <Form.Label>Pergunta de segurança</Form.Label>
            <Form.Select
              {...register("pergunta", {
                required: "Selecione uma pergunta",
              })}
              isInvalid={!!errors.pergunta}
            >
              <option value="">Selecione uma pergunta</option>
              <option value="Qual o nome do seu primeiro animal de estimação?">
                Qual o nome do seu primeiro animal de estimação?
              </option>
              <option value="Qual o nome da sua escola primária?">
                Qual o nome da sua escola primária?
              </option>
              <option value="Qual a cidade onde sua mãe nasceu?">
                Qual a cidade onde sua mãe nasceu?
              </option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.pergunta?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formResposta" className="mt-3">
            <Form.Label>Resposta</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite a resposta"
              {...register("resposta", {
                required: "Resposta é obrigatória",
              })}
              isInvalid={!!errors.resposta}
            />
            <Form.Control.Feedback type="invalid">
              {errors.resposta?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </>
      )}
    </>
  );

  return (
    <div>
      <NavBarPetAgenda />
      <div className="tela-cadastro">
        <Container className="cadastro-container">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6} xl={5}>
              <div className="form-container">
                <div className="cabecalho-form text-center">
                  <h1>Crie uma conta</h1>
                  <p>
                    Já tem uma conta? <a href="/login">Entrar</a>
                  </p>
                </div>

                <div className="barra-progresso">
                  {etapas.map((etapa, index) => (
                    <div className="etapa" key={etapa.id}>
                      {index > 0 && <div className="linha" />}
                      <div
                        className={`bolinha ${
                          etapaAtual === etapa.id ? "ativa" : ""
                        }`}
                      >
                        {etapa.id}
                      </div>
                      <span
                        className={`label ${
                          etapaAtual === etapa.id ? "ativa" : ""
                        }`}
                      >
                        {etapa.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Form onSubmit={ (e) => {e.preventDefault(); onNext(); console.log('submit')}}>
                  {renderConteudo()}

                  <div className="botoes-navegacao mt-4 d-flex">

                    {etapaAtual < etapas.length ? (
                      <Button variant="primary" type="button" onClick={onNext} className="botao">
                        Próximo
                      </Button>
                    ) : (
                      <Button variant="primary" type="submit" className="botao"
                        disabled={!!isLoading}
                        onClick={(e) => { if (etapaAtual == 3) cadastrarUsuario() }}
                      >
                        Cadastrar-se
                        {isLoading && <span style={{display: 'inline-block', marginLeft: '0.8em', verticalAlign: 'center'}}>
                          <LoadingOutlined />
                        </span>}
                      </Button>
                    )}
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Registrar;
