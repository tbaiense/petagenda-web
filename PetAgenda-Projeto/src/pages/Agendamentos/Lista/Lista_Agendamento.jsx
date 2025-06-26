import React, { useState, useEffect } from "react";
import {
  Stack,
  FloatingLabel,
  Tabs,
  Dropdown,
  Tab,
  Pagination,
  Table,
  Accordion,
  Container,
  Form,
  Row,
  Col,
  Button,
  FormCheck,
  Card,
  Nav,
} from "react-bootstrap";
import { Input } from 'antd';
import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/UserContext";
import "../Lista/Lista_Agendamento.module.css";
import { useNavigate } from "react-router-dom";
import Modal_Atualizar_Rapido_ServicoRealizado from "./Modal_Atualizar_Rapido_ServicoRealizado";
import CardAgendamento from "../../../components/CardAgendamento/CardAgendamento";
import CardServicoRealizado from "../../../components/CardServicoRealizado/CardServicoRealizado";

const { Search } = Input;

const Lista_Agendamentos = () => {
  const [pesquisando, setPesquisando] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ ordenacao, setOrdenacao ] = useState('');
  const [ filtroEstado, setFiltroEstado ] = useState('');
  const [ abaAtual, setAbaAtual ] = useState('agendamentos');
  const { empresaFetch, validar } = useAuth();
  const navigate = useNavigate();
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [paginaAtualServ, setPaginaAtualServ] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [paginas, setPaginas] = useState([]);
  const [paginasServ, setPaginasServ] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicosRealizados, setServicosRealizados] = useState([]);
  const [funcDisponiveis, setFuncDisponiveis] = useState([]);
  const [ showModalServ, setShowModalServ ] = useState(false);
  const [ editarServ, setEditarServ ] = useState({});
  const [ tipoFiltro, setTipoFiltro ] = useState('cliente');

  async function popularFuncionarios() {
    empresaFetch("/funcionario")
      .then((res) => res.json())
      .then((data) => {
        setFuncDisponiveis(data.funcionarios);
      })
      .catch((error) => {
        console.error("Erro ao buscar Funcionarios:", error);
      });
  }

  useEffect(() => {
    if (validar) {
      popularFuncionarios();
    }
  }, []);

  async function popularAgendamentos() {
    setPesquisando(true);
    const limit = 6;
    const resp = await empresaFetch(
      `/agendamento?query=${searchQuery}&option=${tipoFiltro}&estado=${filtroEstado}&ordenacao=${ordenacao}&limit=${limit}&page=${paginaAtual}`
    );

    if (resp.status != 200) {
      setAgendamentos([]);
    } else {
      const { qtdAgendamento, agendamentos: agendList } = await resp.json();
  
      if (agendList.length > 0) {
        const pageList = [];
  
        for (let i = 1; i <= Math.ceil(qtdAgendamento / limit); i++) {
          pageList.push(i);
        }
  
        setPaginas(pageList);
        setAgendamentos(
          agendList.map((a) => ({
            ...a,
            funcionario: a.funcionario ? a.funcionario : { id: "" },
          }))
        );
      }
    }

    setPesquisando(false);
    console.log('desliquei')
  }

  async function popularServicosRealizados() {
    const limit = 6;
    const resp = await empresaFetch(
      `/servico-realizado?query=${searchQuery}&option=${tipoFiltro}&ordenacao=${ordenacao}&limit=${limit}&page=${paginaAtualServ}`
    );

    if (resp.status != 200) {
      setServicosRealizados([]);
    } else {
      const { qtdServicosRealizados, servicosRealizados: servList } =
        await resp.json();
  
      if (servList.length > 0) {
        const pageList = [];
  
        for (let i = 1; i <= Math.ceil(qtdServicosRealizados / limit); i++) {
          pageList.push(i);
        }
  
        setPaginasServ(pageList);
        setServicosRealizados(servList);
      }
    }
    setPesquisando(false);
    console.log('desliquei')
  }

  function handleEditarServ(serv) {
    setShowModalServ(true);
    setEditarServ(serv);
  }

  useEffect(() => {
    console.log([abaAtual, paginaAtual, paginaAtualServ, searchQuery, refresh]);
    if (validar) {
      if (abaAtual == 'agendamentos') {
        popularAgendamentos();
      } else if (abaAtual == 'servicos-executados') {
        popularServicosRealizados();
      }
    }
  }, [abaAtual, paginaAtual, paginaAtualServ, searchQuery, refresh]);


  useEffect(() => {
    if (validar) {
      setTimeout(() => {
        setRefresh(refresh + 1);
      }, 2000);
    }
  }, [refresh]);

  return (
    <div className="lista_agendamentos_servicos mt-4">
      <Container>
        {/* Topo */}
        <div>
          <Row>
            <Col className="mb-3">
              <h2>Agendamentos e serviços executados</h2>
            </Col>
            <Col>
              <Dropdown>
                <Dropdown.Toggle className="botao_cadastrar" id="dropdown-basic">
                  Cadastrar novo
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) => {
                      navigate("/empresa/agendamentos/cadastrar");
                    }}
                  >
                    Agendamento
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      navigate("/empresa/servicos/realizados/cadastrar");
                    }}
                  >
                    Serviço Realizado
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col className="campos-espaco">
              <Search
                placeholder="Digite o que deseja pesquisar..."
                enterButton="Pesquisar"
                size="large"
                loading={pesquisando}
                onSearch={(value, event, type) => {
                  const searchQuery = value.trim();
                  if (!searchQuery) {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(searchQuery);
                  }

                }}
              />
            </Col>
            <Col className="campos-espaco">
              <Form.Select
                className="form-button"
                aria-label="Default select example"
                defaultValue={tipoFiltro}
                onChange={ (e) => setTipoFiltro(e.target.value) }
              >
                <option value="cliente">Nome do cliente</option>
              </Form.Select>
            </Col>
            <Col className="campos-espaco">
              <Form.Select
                className="form-button"
                aria-label="Default select example"
                onChange={(e) => {
                  setOrdenacao(e.target.value);
                }}
              >
                <>
                  <option value="ascending">Crescente</option>
                  <option value="descending">Decrescente</option>
                </>
              </Form.Select>
            </Col>
            {
              abaAtual == 'agendamentos' 
              && <Col className="campos-espaco">
                <Form.Select
                  className="form-button"
                  aria-label="Default select example"
                  onChange={(e) => {
                    setFiltroEstado(e.target.value);
                  }}
                >
                  <option>Todos</option>
                  <option value="criado">Criado</option>
                  <option value="preparado">Preparado</option>
                  <option value="pendente">Pendente</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </Form.Select>
              </Col>
            }
          </Row>
        </div>
        {/* Nav */}
        <Tabs
          id="uncontrolled-tab-example"
          activeKey={abaAtual}
          onSelect={(k) => {
            setAbaAtual(k);
            console.log('aba mudada! ', k)
          }}
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
                {agendamentos &&
                  agendamentos.map((a) => {
                    return (
                      <CardAgendamento
                        funcDisponiveis={funcDisponiveis}
                        key={a.id}
                        agendamento={a}
                      />
                    );
                  })
                }
              </tbody>
            </Table>
            {paginas.length > 1 && (
              <Pagination>
                <Pagination.First
                  onClick={() => {
                    setPaginaAtual(0);
                  }}
                />
                {paginas.map((p) => (
                  <Pagination.Item
                    active={p - 1 == paginaAtual}
                    key={p}
                    onClick={() => {
                      setPaginaAtual(p - 1);
                    }}
                  >
                    {p}
                  </Pagination.Item>
                ))}
                <Pagination.Last
                  onClick={() => {
                    setPaginaAtual(paginas[paginas.length - 1] - 1);
                  }}
                />
              </Pagination>
            )}
          </Tab>
          <Tab eventKey="servicos-executados" title="Serviços executados">
            {
              showModalServ && 
              <Modal_Atualizar_Rapido_ServicoRealizado
                show={showModalServ}
                setShow={setShowModalServ}
                servicoRealizado={editarServ}
                handleRefresh={popularServicosRealizados}
              />
            }
            <Table striped>
              <thead>
                <tr>
                  <th>Editar</th>
                  <th>Serviço</th>
                  <th>Nome do cliente</th>
                  <th>Funcionário atribuído</th>
                  <th>Data</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicosRealizados &&
                  servicosRealizados.map((s) => {
                    return (
                      <CardServicoRealizado
                        key={s.id}
                        servicoRealizado={s}
                        handleEditar={handleEditarServ}
                      />
                    );
                  })}
              </tbody>
            </Table>
            {paginasServ.length > 1 && (
              <Pagination>
                <Pagination.First
                  onClick={() => {
                    setPaginaAtualServ(0);
                  }}
                />
                {paginasServ.map((p) => (
                  <Pagination.Item
                    active={p - 1 == paginaAtualServ}
                    key={p}
                    onClick={() => {
                      setPaginaAtualServ(p - 1);
                    }}
                  >
                    {p}
                  </Pagination.Item>
                ))}
                <Pagination.Last
                  onClick={() => {
                    setPaginaAtualServ(paginasServ[paginasServ.length - 1] - 1);
                  }}
                />
              </Pagination>
            )}
          </Tab>
          <Tab eventKey="todos" title="Todos">
            Tab content for Contact
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default Lista_Agendamentos;
