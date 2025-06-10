import React, { useState, useEffect } from "react";
import Stack from 'react-bootstrap/Stack';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Container, Form, Row, Col, Button, FormCheck } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./Cadastrar_Agendamento.css";
import { useAuth } from "../../../contexts/UserContext"

const Agendamento = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [ clientes, setClientes ] = useState([]);
  const [ petsCliente, setPetsCliente ] = useState([]);
  const [ servicos, setServicos ] = useState([]);
  const [ funcionarios, setFuncionarios ] = useState([]);
  const { empresaFetch, validar } = useAuth();

  async function popularServicosOferecidos() {
    empresaFetch('/servico-oferecido')
      .then(res => res.json())
      .then(data => {
        setServicos(data.servicosOferecidos);
      })
      .catch(error => {
          console.error("Erro ao buscar serviçoes oferecidos:", error);
      });
  }

  async function popularClientes() {
    empresaFetch('/cliente')
      .then(res => res.json())
      .then(data => {
          setClientes(data.clientes);
      })
      .catch(error => {
          console.error("Erro ao buscar Clientes:", error);
      });
  }

  async function popularPetsCliente() {
    empresaFetch(`/pet?idCliente=${watch("cliente")}`)
      .then(res => res.json())
      .then(data => {
          setPetsCliente(data.pets);
      })
      .catch(error => {
          console.error("Erro ao buscar Clientes:", error);
      });
  }

  async function popularFuncionarios() {
    empresaFetch('/funcionario')
      .then(res => res.json())
      .then(data => {
          setFuncionarios(data.funcionarios);
      })
      .catch(error => {
          console.error("Erro ao buscar Funcionarios:", error);
      });

  }

  useEffect(() => {
    if (validar) {
      popularServicosOferecidos();
      popularClientes();
      popularPetsCliente();
      popularFuncionarios();
    }
  }, []);

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

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
                  {servicos.map((servico) => (
                    <option key={servico.id} value={servico.id}>
                      {servico.nome}
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
                  {funcionarios && funcionarios.map((funcionario) => (
                    <option key={funcionario.id} value={funcionario.id}>
                      {funcionario.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
              <h2 className="mt-4">Pets participantes</h2>
              <hr></hr>
          </Row>
          <Row className="mt-3">
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Cliente:</Form.Label>
                <Form.Select {...register("cliente")}>
                  <option value="">Selecione um cliente</option>
                  {clientes && clientes.map((cli) => (
                    <option key={cli.id} value={cli.id}>
                      {cli.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Pet:</Form.Label>
                <Form.Select {...register("pet")}>
                  <option value="">Selecione um pet</option>
                  {petsCliente && petsCliente.map((pet) => (
                    <option key={pet.id} value={pet}>
                      {pet.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Button variant="secondary" type="submit">
                Adicionar
              </Button>
            </Col>
          </Row>
    
          {/* Card de pets */}
          <Accordion className="mt-3 mb-4" defaultActiveKey="0" flush alwaysOpen>
            <Accordion.Item eventKey="0">
              {/* Título de pet */}
              <Accordion.Header>
                  <Stack direction="horizontal" gap={3}>
                    <h4 className="me-auto">Rika</h4>
                    <span style={{ fontSize: '1.0em',border: '1px solid grey', borderRadius: '2em', paddingInline: '1em', paddingBlock: '0.3em'}}>Gato</span>
                    <span>✕</span>
                  </Stack>
              </Accordion.Header>
              <Accordion.Body style={{ backgroundColor: 'lightpink',paddingInline: '3em'}}>
                <Row>
                  <div>
                  <FloatingLabel className="mt-2 mb-4" controlId="floatingTextarea2" label="Instruções de alimentação">
                    <Form.Control
                      as="textarea"
                      placeholder="Deixe aqui uma instrução para a alimentação do pet"
                      style={{ height: '70px' }}
                    />
                  </FloatingLabel>
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
                {/* Remedios */}
                <div >
                  <Row style={{ borderTop: "1px solid grey"}} className="pt-3 mt-4">
                    <Stack direction="horizontal" gap={3}>
                      <h4 className="me-auto">Dipirona monohidratada 100g</h4>
                      <span>✕</span>
                    </Stack>
                  </Row>
                  <Row>
                    <p>Após ao almoço, duas vezes ao dia depois de refeições.</p>
                  </Row>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          {/* Endereços ======================================================*/}
          <h5>Endereços</h5>
          <hr />
          <Accordion className="mt-3 mb-4" defaultActiveKey="0" flush alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                  <Stack direction="horizontal" gap={3}>
                  <span>Buscar</span>
                      <Button variant="primary" type="submit" className="mt-4">
                        Limpar
                      </Button>
                  </Stack>
              </Accordion.Header>
              <Accordion.Body style={{ backgroundColor: 'lightpink',paddingInline: '3em'}}>
                <Row>
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
                </Row>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                  <Stack direction="horizontal" gap={3}>
                    <span>Devolver</span>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <FormCheck></FormCheck>
                      <Form.Label>O mesmo do anterior</Form.Label>
                    </Form.Group>  
                    <Button variant="primary" type="submit" className="mt-4">
                      Limpar
                    </Button>
                  </Stack>
              </Accordion.Header>
              <Accordion.Body style={{ backgroundColor: 'lightpink',paddingInline: '3em'}}>
                <Row>
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
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Row>
            <FloatingLabel className="mt-4" controlId="floatingTextarea2" label="Observações">
              <Form.Control
                as="textarea"
                placeholder="Deixe aqui uma observação"
                style={{ height: '150px' }}
              />
            </FloatingLabel>
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