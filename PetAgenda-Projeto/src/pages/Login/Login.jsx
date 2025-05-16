import React from "react";
import "./Login.css";
import {
  Container,
  Row,
  Col,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";

function Login() {
  return (
    <Container className="login_container">
      <Row className="w-100">
        <Col
          md={6}
          className="d-flex justify-content-center align-items-center"
        >
          <Form style={{ width: "100%", maxWidth: "400px" }}>
            <h1 className="mb-4 text-center">Login</h1>

            <Form.Group controlId="formEmail">
              <FloatingLabel
                controlId="floatingEmail"
                label="E-mail"
                className="mb-3"
              >
                <Form.Control type="email" placeholder="name@example.com" />
              </FloatingLabel>
            </Form.Group>

            <Form.Group controlId="formPassword">
              <FloatingLabel
                controlId="floatingPassword"
                label="Senha"
                className="mb-3"
              >
                <Form.Control type="password" placeholder="senha" />
              </FloatingLabel>
            </Form.Group>

            <Row className="d-flex">
              <Col md={6}>
                <Form.Group controlId="formRemember" className="mb-3">
                  <Form.Check type="checkbox" label="Lembrar de mim" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <div className="mb-3 text-end">
                  <a href="#">Esqueceu a senha?</a>
                </div>
              </Col>
            </Row>
            <Button type="submit" className="w-100">
              Entrar
            </Button>
          </Form>
        </Col>
        <Col md={6} className="d-none d-md-block p-0">
          <img
            src="https://placehold.co/600x800"
            alt="Login visual"
            className="w-100 h-100 object-fit-cover"
            style={{ objectFit: "cover" }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
