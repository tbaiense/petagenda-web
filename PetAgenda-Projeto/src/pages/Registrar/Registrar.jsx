import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Button, Form, Row, Col } from "react-bootstrap";
import "./Registrar.css";
import { useAuth  } from "../../contexts/UserContext";

function Registrar() {
  const navigate = useNavigate();
  const { apiFetch } = useAuth();

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");

  const etapas = [
    { id: 1, label: "Insira endereço de e-mail" },
    { id: 2, label: "Crie sua senha" },
    { id: 3, label: "Pergunta de segurança" },
  ];

  const proximaEtapa = () => {
    if (etapaAtual <= etapas.length) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const cadastrarUsuario = async (usr) => {
    const response = await apiFetch(
      '/usuario', 
      {method: "POST",body: JSON.stringify(usr)}
    );

    const body = await response.json();
    
    if (body?.success) {
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } else {
      alert('Falha ao realizar cadastro: ' + body.errors[0].message);
      setEtapaAtual(1);
    }

    return;
  };

  const handleSubmit = (data) => {
    const usuario = {
      email: email,
      senha: senha,
      perguntaSeguranca: {
        pergunta: pergunta,
        resposta: resposta
      }
    }

    cadastrarUsuario(usuario);
  
  };

  const renderConteudo = () => {
    return (
      <Form id="signup-form" action={handleSubmit}>
        {etapaAtual === 1 && (
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              required
            />
          </Form.Group>
        )}

        {etapaAtual === 2 && (
          <>
            <Form.Group controlId="formSenha">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                name="senha"
                onChange={(e) => setSenha(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formConfirmarSenha" className="mt-3">
              <Form.Label>Confirmar Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite novamente"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </Form.Group>
          </>
        )}

        {etapaAtual === 3 && (
          <>
            <Form.Group controlId="formPergunta">
              <Form.Label>Pergunta de segurança</Form.Label>
              <Form.Select
                value={pergunta}
                onChange={(e) => setPergunta(e.target.value)}
                name="pergunta"
              >
                <option>Selecione uma pergunta</option>
                <option value="Qual o nome do seu primeiro animal de estimação?">
                  Qual o nome do seu primeiro animal de estimação?
                </option>
                <option value="Qual o nome da sua escola primária?">Qual o nome da sua escola primária?</option>
                <option value="Qual a cidade onde sua mãe nasceu?">Qual a cidade onde sua mãe nasceu?</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formResposta" className="mt-3">
              <Form.Label>Resposta</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a resposta"
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                name="resposta"
              />
            </Form.Group>
          </>
        )}
      </Form>
    );
  };

  return (
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

              <div className="conteudo">{renderConteudo()}</div>

              <div className="botoes-navegacao">
                <Button
                  variant="secondary"
                  onClick={etapaAnterior}
                  disabled={etapaAtual === 1}
                >
                  Voltar
                </Button>
                <Button id="next-btn" form="signup-form" type={etapaAtual > etapas.length ? 'submit' : 'button'} variant="primary" onClick={proximaEtapa}>
                  {etapaAtual === etapas.length ? "Cadastrar-se" : "Próximo"}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Registrar;