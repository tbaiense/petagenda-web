import React, { useState, useEffect } from "react";
import { Stack, FloatingLabel, Tabs, Dropdown, Tab, Pagination, Table, Accordion, Container, Form, Row, Col, Button, FormCheck, Card, Nav } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/UserContext";
import "../Lista/Lista_Agendamento.module.css";
import Modal_Atualizar_Rapido_Agendamento from "./Modal_Atualizar_Rapido_Agendamento";

const Lista_Agendamentos = () => {
    const [show, setShow] = useState(false);


    const handleShowEditarModal = () => {
        setShow(true);
    }

    const handleCloseEditarModal = () => {
        setShow(false);
    }


    return (
        <div className="lista_agendamentos_servicos mt-4">
            <Container>
                <Modal_Atualizar_Rapido_Agendamento show={show} setShow={setShow}></Modal_Atualizar_Rapido_Agendamento>
                {/* Topo */}
                <div>
                    <Row>
                        <Col>
                            <h2>Agendamentos e serviços executados</h2>
                        </Col>
                        <Col>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Cadastrar novo
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Agendamento</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Serviço Executado</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>                        
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Control type="text" placeholder="Pesquisar..." />
                        </Col>
                        <Col>
                            <Form.Select className="form-button" aria-label="Default select example">
                                <option>Filtrar por</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select className="form-button" aria-label="Default select example">
                                <option>Ordenar</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </div>
                {/* Nav */}
                <Tabs
                    defaultActiveKey="agendamentos"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="agendamentos" title="Agendamentos">
                    <Table striped>
                        <thead>
                            <tr>
                                <th>Serviço</th>
                                <th>Nome do cliente</th>
                                <th>Funcionário atribuído</th>
                                <th>Data</th>
                                <th>Hora</th>
                                <th>Estado</th>
                                <th>Valor</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Banho e Tosa Completa Para Cães</td>
                                <td>Antônio Souza Ribeiro Albuquerque</td>
                                <td>Marina Tavares Siqueira</td>
                                <td>20/10/2025<br></br>~2 meses</td>
                                <td>08:30</td>
                                <td>Preparando</td>
                                <td>R$ 2220,90</td>
                                <td>
                                    <Button className="form-button" variant="primary" onClick={handleShowEditarModal}>Editar</Button>
                                    <Button className="form-button" variant="success">Detalhes</Button>
                                </td>
                            </tr>
                            <tr>
                                <td>Banho e Tosa Completa Para Cães</td>
                                <td>Antônio Souza Ribeiro Albuquerque</td>
                                <td>Marina Tavares Siqueira</td>
                                <td>20/10/2025<br></br>~2 meses</td>
                                <td>08:30</td>
                                <td>Preparando</td>
                                <td>R$ 2220,90</td>
                                <td>
                                    <Button className="form-button" variant="primary">Editar</Button>
                                    <Button className="form-button" variant="success">Detalhes</Button>
                                </td>
                            </tr>
                            <tr>
                                <td>Banho e Tosa Completa Para Cães</td>
                                <td>Antônio Souza Ribeiro Albuquerque</td>
                                <td>Marina Tavares Siqueira</td>
                                <td>20/10/2025<br></br>~2 meses</td>
                                <td>08:30</td>
                                <td>Preparando</td>
                                <td>R$ 2220,90</td>
                                <td>
                                    <Button className="form-button" variant="primary">Editar</Button>
                                    <Button className="form-button" variant="success">Detalhes</Button>
                                </td>
                            </tr>
                            <tr>
                                <td>Banho e Tosa Completa Para Cães</td>
                                <td>Antônio Souza Ribeiro Albuquerque</td>
                                <td>Marina Tavares Siqueira</td>
                                <td>20/10/2025<br></br>~2 meses</td>
                                <td>08:30</td>
                                <td>Preparando</td>
                                <td>R$ 2220,90</td>
                                <td>
                                    <Button className="form-button" variant="primary">Editar</Button>
                                    <Button className="form-button" variant="success">Detalhes</Button>
                                </td>
                            </tr>
                            <tr>
                                <td>Banho e Tosa Completa Para Cães</td>
                                <td>Antônio Souza Ribeiro Albuquerque</td>
                                <td>Marina Tavares Siqueira</td>
                                <td>20/10/2025<br></br>~2 meses</td>
                                <td>08:30</td>
                                <td>Preparando</td>
                                <td>R$ 2220,90</td>
                                <td>
                                    <Button className="form-button" variant="primary">Editar</Button>
                                    <Button className="form-button" variant="success">Detalhes</Button>
                                </td>
                            </tr>
                            <tr>
                                <td>Banho e Tosa Completa Para Cães</td>
                                <td>Antônio Souza Ribeiro Albuquerque</td>
                                <td>Marina Tavares Siqueira</td>
                                <td>20/10/2025<br></br>~2 meses</td>
                                <td>08:30</td>
                                <td>Preparando</td>
                                <td>R$ 2220,90</td>
                                <td>
                                    <Button className="form-button" variant="primary">Editar</Button>
                                    <Button className="form-button" variant="success">Detalhes</Button>
                                </td>
                            </tr>
                        </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="servicos-executados" title="Serviços executados">
                        Tab content for Profile
                    </Tab>
                    <Tab eventKey="todos" title="Todos">
                        Tab content for Contact
                    </Tab>
                </Tabs>
                <Pagination>
                    <Pagination.First />
                    <Pagination.Prev />
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Item>{2}</Pagination.Item>
                    <Pagination.Item>{3}</Pagination.Item>
                    <Pagination.Item>{4}</Pagination.Item>
                    <Pagination.Next />
                    <Pagination.Last />
                </Pagination>
            </Container>
        </div>
    )
}

export default Lista_Agendamentos