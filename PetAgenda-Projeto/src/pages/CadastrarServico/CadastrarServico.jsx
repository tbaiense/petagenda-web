import React from "react";
import { useForm } from "react-hook-form";
import { Button, Form, InputGroup, Row, Col, Container } from "react-bootstrap";

function CadastrarServico() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset()
  };

  return (
    <Container className="mt-4">
      <h2>Cadastrar Serviço</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite seu email"
                  {...register("email")}
                />
              </Form.Group>
            </Col>
            <Col md={7}>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Digite sua senha"
                  {...register("senha")}
                />
              </Form.Group>
            </Col>
          </Col>
          <Col md={6}>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formValor">
                <Form.Label>Valor</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Valor do serviço"
                    {...register("valor")}
                  />
                  <InputGroup.Text>R$</InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formTipo">
                <Form.Label>Tipo de cobrança</Form.Label>
                <Form.Select {...register("tipo")}>
                  <option value="">Selecione...</option>
                  <option value="por_pet">Por cada pet</option>
                  <option value="por_servico">Por serviço</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Col>
        </Row>

        <div className="text-end">
          <Button variant="primary" type="submit">
            Enviar
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default CadastrarServico;
