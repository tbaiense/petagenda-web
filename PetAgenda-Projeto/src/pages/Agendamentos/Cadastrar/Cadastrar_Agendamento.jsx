import React, { useState } from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Container, Form, Row, Col, Button, FormCheck } from "react-bootstrap";
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
      <h2 className="cadastrar_agendamento__title">Novo agendamento</h2>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Filtrar serviço por:</Form.Label>
                <Form.Select {...register("filtro")}>
                  <option value="">Restrição de espécie</option>
                  <option value="">Todos</option>
                  <option value="">Restrição de participantes</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Tipo do filtro:</Form.Label>
                <Form.Select {...register("tipoFiltro")}>
                  <option value="">Cães</option>
                  <option value="">Gatos</option>
                  <option value="">Pássaros</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
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
          </Row>

          <Row className="mt-3">
            <Col>
              <Form.Group controlId="formData">
                <Form.Label>Data do agendamento</Form.Label>
                <Form.Control
                  type="date"
                  {...register("data")}
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formHora">
                <Form.Label>Hora do agendamento</Form.Label>
                <Form.Control
                  type="time"
                  {...register("hora")}
                  defaultValue="09:00"
                />
              </Form.Group>
            </Col>
             <Col>
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
          <Row>
              <h2>Pets participantes</h2>
              <hr></hr>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Cliente:</Form.Label>
                <Form.Select {...register("cliente")}>
                  <option value="">Selecione um cliente</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Pet:</Form.Label>
                <Form.Select {...register("pet")}>
                  <option value="">Selecione um pet</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Button variant="secondary" type="submit">
                Adicionar
              </Button>
            </Col>
          </Row>
          {/* Card de agendametno */}
          <Row>
            <div>
                  <span>Rika</span>
                  <span>Gato</span>
                  <span>✕</span>
            </div>
            <div>
              <label htmlFor="">
                Instruções de alimentação:
                  <textarea>
                  </textarea>

              </label>
            </div>
            <div>
              <h4>Remédios</h4>
              <hr></hr>
            </div>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Nome do remédio:</Form.Label>
                <Form.Control type="email" placeholder="Dipirona monohidratada..." />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Instruções de administração:</Form.Label>
                <Form.Control type="email" placeholder="Administrar duas vezes ao dia..." />
              </Form.Group>
            </Col>
            <Col>
              <Button variant="primary" type="submit">
                Adicionar
              </Button>
            </Col>
          </Row>
          <Row>
            <div>
              <h5>Dipirona monohidratada 100g ✕</h5>
              <p>Após ao almoço, duas vezes ao dia depois de refeições.</p>
            </div>
          </Row>
          <Row>
            <div>
              <h5>Dipirona monohidratada 100g ✕</h5>
              <p>Após ao almoço, duas vezes ao dia depois de refeições.</p>
            </div>
          </Row>
          {/* Endereços */}
          <h5>Endereços</h5>
          <hr />
          <div>
            {/* Título */}
              <div> 
                <span>Buscar</span>
                <Button variant="primary" type="submit" className="mt-4">
                  Limpar
                </Button>
                  <span>V</span>
              </div>
              <div>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>CEP:</Form.Label>
                      <Form.Control type="email" placeholder="Dipirona monohidratada..." />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Logradouro:</Form.Label>
                      <Form.Control type="email" placeholder="Dipirona monohidratada..." />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-1" controlId="formBasicEmail">
                      <Form.Label>Número:</Form.Label>
                      <Form.Control type="email" placeholder="Dipirona monohidratada..." />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Bairro:</Form.Label>
                      <Form.Control type="email" placeholder="Dipirona monohidratada..." />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Cidade:</Form.Label>
                      <Form.Control type="email" placeholder="Dipirona monohidratada..." />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-1" controlId="formBasicEmail">
                      <Form.Label>Estado:</Form.Label>
                      <Form.Select>
                        <option value="">ES</option>
                        <option value="">RJ</option>
                        <option value="">SP</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
          </div>
          <div>
            <Row>
                <Col>
                  <span>Devolver</span>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <FormCheck></FormCheck>
                    <Form.Label>O mesmo do anterior</Form.Label>
                  </Form.Group>               
                </Col>
                  <Col>
                    <span>V</span>
                  </Col>
            </Row>
            {/* Título */}
              
              <div>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>CEP:</Form.Label>
                      <Form.Control type="email" placeholder="Dipirona monohidratada..." />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Logradouro:</Form.Label>
                      <Form.Control type="email" placeholder="Dipirona monohidratada..." />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-1" controlId="formBasicEmail">
                      <Form.Label>Número:</Form.Label>
                      <Form.Control type="email" placeholder="Dipirona monohidratada..." />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Bairro:</Form.Label>
                      <Form.Control type="email" placeholder="Dipirona monohidratada..." />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Cidade:</Form.Label>
                      <Form.Control type="email" placeholder="Dipirona monohidratada..." />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-1" controlId="formBasicEmail">
                      <Form.Label>Estado:</Form.Label>
                      <Form.Select>
                        <option value="">ES</option>
                        <option value="">RJ</option>
                        <option value="">SP</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <FloatingLabel controlId="floatingTextarea2" label="Comments">
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      style={{ height: '100px' }}
                    />
                  </FloatingLabel>
                </Row>
              </div>
          </div>
          <div>
              
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