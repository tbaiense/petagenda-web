import React, { useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./Cadastrar_Agendamento.css";

const Agendamento = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  const servicos = ["Tosa", "Tosa1", "Tosa2"];
  const funcionarios = ["João", "Maria", "Carlos"];

  return (
    <div className="cadatrar_agendamento mt-4">
      <h2 className="cadastrar_agendamento__title">Cadastrar Serviço</h2>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={5}>
              <Form.Group controlId="formServico">
                <Form.Label>Serviço</Form.Label>
                <Form.Select {...register("servico")}>
                  <option value="">Selecione um serviço</option>
                  {servicos.map((servico, idx) => (
                    <option key={idx} value={servico}>
                      {servico}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} />
            <Col md={5}>
              <Form.Group controlId="formFuncionario">
                <Form.Label>Funcionário</Form.Label>
                <Form.Select {...register("funcionario")}>
                  <option value="">Selecione um funcionário</option>
                  {funcionarios.map((funcionario, idx) => (
                    <option key={idx} value={funcionario}>
                      {funcionario}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={4}>
              <Form.Group controlId="formData">
                <Form.Label>Data do agendamento</Form.Label>
                <Form.Control
                  type="date"
                  {...register("data")}
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </Form.Group>
            </Col>
            <Col md={3} />
            <Col md={3}>
              <Form.Group controlId="formHora">
                <Form.Label>Hora do agendamento</Form.Label>
                <Form.Control
                  type="time"
                  {...register("hora")}
                  defaultValue="09:00"
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" className="mt-4">
            Agendar
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Agendamento;