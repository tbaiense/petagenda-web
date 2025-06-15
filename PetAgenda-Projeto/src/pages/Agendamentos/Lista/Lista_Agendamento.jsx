import React, { useState, useEffect } from "react";
import { Stack, FloatingLabel, Tabs, Dropdown, Tab, Pagination, Table, Accordion, Container, Form, Row, Col, Button, FormCheck, Card, Nav } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/UserContext";
import "../Lista/Lista_Agendamento.module.css";
import Modal_Atualizar_Rapido_Agendamento from "./Modal_Atualizar_Rapido_Agendamento";
import CardAgendamento from "../../../components/CardAgendamento/CardAgendamento";
import { useNavigate } from 'react-router-dom';

const Lista_Agendamentos = () => {
    const { empresaFetch, validar } = useAuth();
    const navigate = useNavigate();
    const [ paginaAtual, setPaginaAtual ] = useState(0);
    const [ refresh, setRefresh ] = useState(0);
    const [ paginas, setPaginas ] = useState([]);
    const [ agendamentos, setAgendamentos ] = useState([/*}
        {
            "id": 1,
            "idInfoServico": 1,
            "dtHrMarcada": "2025-06-13 22:12:00",
            "servico": {
                "id": 2,
                "nome": "Dog Walking",
                "categoria": 7,
                "nomeCategoria": "PetCare"
            },
            "valor": {
                "servico": 0,
                "pets": 59.9,
                "total": 59.9
            },
            "funcionario": {
                "id": 1,
                "nome": "Maria Joaquina Silveira"
            },
            "estado": {
                "id": "preparado"
            },
            "pets": [
                {
                    "id": 1,
                    "instrucaoAlim": "Alimentar com petiscos leves",
                    "remedios": [
                        {
                            "id": 1,
                            "nome": "Torcilax",
                            "instrucoes": "Uma vez após a primeira refeição"
                        }
                    ]
                }
            ]
        }
    */]);

    const [ funcDisponiveis, setFuncDisponiveis ] = useState([]);
    async function popularFuncionarios() {        
        empresaFetch('/funcionario')
        .then(res => res.json())
        .then(data => {
            setFuncDisponiveis(data.funcionarios);
        })
        .catch(error => {
            console.error("Erro ao buscar Funcionarios:", error);
        });
    }

    useEffect(() => {
        if (validar) {
            popularFuncionarios();
        }
    }, []);

    async function popularAgendamentos() {
        const limit = 6;
        const resp = await empresaFetch(`/agendamento?limit=${limit}&page=${paginaAtual}`);

        if (resp.status != 200) {
            console.log('falha ao obter agendamentos!')
            return;
        }

        const { qtdAgendamento, agendamentos: agendList } = await resp.json();

        if (agendList.length > 0) {
            const pageList = [];

            for (let i = 1; i <= Math.ceil(qtdAgendamento / limit) ; i++) {
                pageList.push(i);
            }

            setPaginas(pageList);
            setAgendamentos(agendList.map( a => ({ ...a, funcionario: (a.funcionario) ? a.funcionario : { id: "" }})));
        }
    }
    useEffect(() => {
        if (validar) {
            popularAgendamentos();
        }
    }, [paginaAtual]);

    useEffect(() => {
        if (validar) {
            setTimeout(() => {
                setRefresh(refresh + 1)
            }, 2000);
        }
    }, [refresh]);

    useEffect(() => {
        console.log('refresh agendamentos!')
    }, [agendamentos]);

    useEffect(() => {
        popularAgendamentos();
    }, [refresh]);

    return (
        <div className="lista_agendamentos_servicos mt-4">
            <Container>
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
                                    <Dropdown.Item onClick={(e) => {navigate('/empresa/agendamentos/cadastrar')}}>Agendamento</Dropdown.Item>
                                    <Dropdown.Item onClick={ e => {navigate('/empresa/servicos/realizados/cadastrar')}}>Serviço Executado</Dropdown.Item>
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
                            { agendamentos && agendamentos.map( a => {
                                return <CardAgendamento funcDisponiveis={funcDisponiveis} key={a.id} agendamento={a}/>
                            })}
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
                { paginas.length > 1 && 
                    <Pagination>
                        <Pagination.First onClick={ () => {setPaginaAtual(0)}}/>
                        { paginas.map( p => 
                            <Pagination.Item
                                active={ p-1 == paginaAtual }
                                key={p}
                                onClick={ () => {setPaginaAtual(p-1)} }>{p}
                            </Pagination.Item>
                        )}
                        <Pagination.Last onClick={ () => { setPaginaAtual(paginas[paginas.length - 1] -1) }}/>
                    </Pagination>
                }
            </Container>
        </div>
    )
}

export default Lista_Agendamentos