import React, { useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import CamposEndereco from "../../../components/Endereco/CamposEndereco";
import "./Cadastrar_Agendamento.css";

const Agendamento = () => {
  const { register, handleSubmit, reset } = useForm();
  const [enderecosExtras, setEnderecosExtras] = useState([]);

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  const adicionarEndereco = () => {
    setEnderecosExtras((prev) => [...prev, {}]);
  };

  const removerEndereco = (indexToRemove) => {
    setEnderecosExtras((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
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

          <div className="mt-4">
            <Row className="align-items-center mb-2">
              <Col xs="auto">
                <h3 className="mb-0">Pets</h3>
              </Col>
              <Col xs="auto">
                <button
                  type="button"
                  onClick={adicionarEndereco}
                  disabled={enderecosExtras.length >= 1}
                  className="me-2 estiloTitulos"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (enderecosExtras.length > 0) {
                      removerEndereco(enderecosExtras.length - 1);
                    }
                  }}
                  disabled={enderecosExtras.length === 0}
                  className="estiloTitulos"
                >
                  -
                </button>
              </Col>
            </Row>

            <hr />

            <h5>Endereço de busca</h5>
            <CamposEndereco register={register} index={null} />

            {enderecosExtras.map((_, index) => (
              <div key={`endereco-extra-${index}`}>
                <h5 className="mt-3">Endereço de entrega</h5>
                <CamposEndereco
                  register={register}
                  index={index}
                  onRemove={() => removerEndereco(index)}
                />
              </div>
            ))}
          </div>

          <Button variant="primary" type="submit" className="mt-4">
            Agendar
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Agendamento;
