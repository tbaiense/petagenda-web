import React from "react";
import "./Login.css";
import { Container, Col, Form, Button, FloatingLabel } from "react-bootstrap";

function Login() {
  return (
    <Container>
      <Form>
        <Col>
          <h1>Login</h1>
          <Form.Group controlId="formEmail">
            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3"
            >
              <Form.Control type="email" placeholder="name@example.com" />
            </FloatingLabel>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3"
            >
              <Form.Control type="email" placeholder="name@example.com" />
            </FloatingLabel>
          </Form.Group>

          <Form.Group controlId="formRemember">
            <Form.Check type="checkbox" label="Lembrar de mim" />
          </Form.Group>

          <div>
            <a href="#">Esqueceu a senha?</a>
          </div>

          <Button type="submit">Entrar</Button>
        </Col>
      </Form>
    </Container>
  );
}

export default Login;
