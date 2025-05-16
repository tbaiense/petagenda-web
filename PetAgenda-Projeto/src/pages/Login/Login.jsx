import React from "react";
import NavBarPetAgenda from "../../components/NavBarPetAgenda";
import {
  Container,
  Col,
  FloatingLabel,
  Form,
  Row,
  Button,
} from "react-bootstrap";
import "./Login.css";
function Login() {
  return (
    <div>
      <NavBarPetAgenda />
      <Container className="login__container mt-5">
        <Row className="align-items-center login__column">
          <Col md={6} className="d-flex flex-column align-items-center">
            <Row>
              <div className="mb-4">
                <h1>Bem-vindo</h1>
              </div>
            </Row>
            <Row style={{ width: "90%", maxWidth: "500px" }}>
              <Form className="">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email"
                  className="mb-3 "
                >
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    className="login__input"
                  />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    className="login__input"
                  />
                </FloatingLabel>
                <Button
                  type="submit"
                  className="mt-4 mb-4 login__button mx-auto d-block"
                >
                  Enviar
                </Button>
              </Form>
            </Row>
          </Col>
          <Col md={6} className="d-none d-md-flex">
            <img
              src="https://placehold.co/660x800"
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
