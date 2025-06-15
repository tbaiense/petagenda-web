import React, { useState, useEffect } from "react";
import { Stack, FloatingLabel, Tabs, Dropdown, Tab, Pagination, Table, Accordion, Container, Form, Row, Col, Button, FormCheck, Card, Nav } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/UserContext";
import "./Lista_ServicosOferecidos.module.css";
import CardServicoOferecido from "../../../components/CardServicoOferecido/CardServicoOferecido";
import { useNavigate } from 'react-router-dom';

const Lista_ServicosOferecidos = () => {
    const { empresaFetch, validar } = useAuth();
    const navigate = useNavigate();
    const [ paginaAtual, setPaginaAtual ] = useState(0);
    const [ refresh, setRefresh ] = useState(0);
    const [ paginas, setPaginas ] = useState([]);
    const [ servicosOferecidos, setServicosOferecidos ] = useState([/*}
        {
            "id": 3,
            "nome": "Capivara e Gato",
            "categoria": 6,
            "nomeCategoria": "Creche",
            "preco": 231,
            "tipoPreco": "pet",
            "restricaoParticipante": "coletivo",
            "restricaoEspecie": [
                {
                    "especie": 2,
                    "nomeEspecie": "Gato"
                },
                {
                    "especie": 8,
                    "nomeEspecie": "Capivara"
                }
            ]
        }
    */]);

    async function popularServicosOferecidos() {
        const limit = 6;
        const resp = await empresaFetch(`/servico-oferecido?limit=${limit}&page=${paginaAtual}`);

        if (resp.status != 200) {
            console.log('falha ao obter serviços oferecidos!')
            return;
        }

        const { qtdServicosOferecidos, servicosOferecidos: servList } = await resp.json();

        if (servList.length > 0) {
            const pageList = [];

            for (let i = 1; i <= Math.ceil(qtdServicosOferecidos / limit) ; i++) {
                pageList.push(i);
            }

            setPaginas(pageList);
            setServicosOferecidos(servList);
        }
    }
    useEffect(() => {
        if (validar) {
            popularServicosOferecidos();
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
        console.log('refresh servicosOferecidos!')
    }, [servicosOferecidos]);

    useEffect(() => {
        popularServicosOferecidos();
    }, [refresh]);

    return (
        <div className="lista_servicos_oferecidos_servicos mt-4">
            <Container>
                {/* Topo */}
                <div>
                    <Row>
                        <Col >
                            <h2>Serviços oferecidos</h2>
                        </Col>
                        <Col>
                                <Button variant="success" id="dropdown-basic" onClick={()=> {navigate('/empresa/servicos/cadastrar')}}>
                                    Cadastrar +
                                </Button>                     
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
                <Table striped>
                    <thead>
                        <tr>
                            <th>Serviço</th>
                            <th>Categoria</th>
                            <th>Participantes</th>
                            <th>Espécies</th>
                            <th>Cobrança</th>
                            <th>Valor</th>
                            <th colSpan="2" >Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <CardServicoOferecido key={0} servicoOferecido={{
                            "id": 3,
                            "nome": "Capivara e Gato",
                            "categoria": 6,
                            "nomeCategoria": "Creche",
                            "preco": 231,
                            "tipoPreco": "pet",
                            "restricaoParticipante": "coletivo",
                            "restricaoEspecie": [
                                {
                                    "especie": 2,
                                    "nomeEspecie": "Gato"
                                },
                                {
                                    "especie": 8,
                                    "nomeEspecie": "Capivara"
                                }
                            ]
                        }}/> */}
                        { servicosOferecidos && servicosOferecidos.map( s => {
                            return <CardServicoOferecido key={s.id} servicoOferecido={s}/>
                        })}
                    </tbody>
                </Table>
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

export default Lista_ServicosOferecidos