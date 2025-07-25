import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/UserContext";
import NavBarPetAgenda from "../../components/NavBar/NavBarPetAgenda";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Container,
  Col,
  FloatingLabel,
  Form,
  Row,
  Button,
} from "react-bootstrap";
import { Alert } from "antd";
import "./Login.css";
import image1 from "../../assets/ImagensProjeto/pet4.png";
function Login() {
  const navigate = useNavigate();
  const [mensagemAlerta, setMensagemAlerta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    setToken,
    removeToken,
    setUsuario,
    removeUsuario,
    setEmpresa,
    removeEmpresa,
    apiFetch,
  } = useAuth();

  const checkCredentials = async (userCredentials) => {
    console.log("checando credenciais...");
    setIsLoading(true);
    apiFetch("/usuario/login", {
      method: "POST",
      body: JSON.stringify(userCredentials),
    })
      .then(async (response) => {
        setIsLoading(false);

        switch (response.status) {
          case 200: {
            const jsonResponse = await response.json();

            const { token, usuario, empresas } = jsonResponse;

            if (!token || !usuario.id) {
              const msg = "Falha ao obter informações do usuário!";
              alert(msg);
              throw new Error(msg);
            }

            removeToken();
            removeUsuario();
            removeEmpresa();

            if (token) {
              setToken(token); // Armazena no local storage
            }
            if (usuario) {
              setUsuario(usuario);
            }

            if (empresas && empresas[0]) {
              setEmpresa(empresas[0]);
            }
            setMensagemAlerta({
              tipo: "success",
              titulo: "Login realizado com sucesso!",
              descricao: "Redirecionando para o dashboard...",
            });
            setTimeout(() => {
              setMensagemAlerta(null);
            }, 2500);

            await new Promise((resolve) => setTimeout(resolve, 2500));

            navigate("/empresa/dashboard");
            break;
          }

          case 400: {
            setMensagemAlerta({
              tipo: "error",
              titulo: "Erro de Login",
              descricao: "Usuário ou senha incorretos.",
            });
            setTimeout(() => {
              setMensagemAlerta(null);
            }, 2500);
            break;
          }
          default: {
            alert(
              "Erro ao realizar autenticação: HTTP Status Code não esperado."
            );
          }
        }
      })
      .catch((err) => {
        (err.message = "Erro ao realizar autenticação: "), err.message;
        alert(err.message);
        console.log(err);
      });
  };

  const handleSubmit = (formData) => {
    const userCredentials = {
      email: formData.get("email"),
      senha: formData.get("senha"),
    };

    checkCredentials(userCredentials);
  };

  return (
    <div>
      <NavBarPetAgenda />
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
      <Container className="login__container mt-5">
        <Row className="align-items-center login__column">
          <Col md={6} className="d-flex flex-column align-items-center">
            <Row>
              <div className="mb-4">
                <h1>Bem-vindo</h1>
              </div>
            </Row>
            <Row style={{ width: "90%", maxWidth: "500px" }}>
              <Form action={handleSubmit} className="">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email"
                  className="mb-3 "
                >
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    className="login__input"
                    name="email"
                  />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    className="login__input"
                    name="senha"
                  />
                </FloatingLabel>
                <Button
                  type="submit"
                  className="mt-4 mb-4 login__button mx-auto d-block"
                  disabled={!!isLoading}
                >
                  Entrar
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
              </Form>
            </Row>
          </Col>
          <Col md={6} className="d-none d-md-flex">
            <img
              src={image1}
              alt="Visual login"
              className="img-fluid login__img"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
