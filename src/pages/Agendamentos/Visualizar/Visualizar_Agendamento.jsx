import React, { useState, useEffect } from "react";
import Stack from "react-bootstrap/Stack";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import {
  Container,
  Form,
  Row,
  Col,
  Button,
  FormCheck,
  InputGroup,
} from "react-bootstrap";

import { useForm } from "react-hook-form";
import "./Visualizar_Agendamento.css";
import { useAuth } from "../../../contexts/UserContext";
import PetServicoCardList from "../../../components/CardPet/PetServicoCardList";
import CamposEndereco from "../../../components/Endereco/CamposEndereco";
import "../../../components/CardPet/PetServicoCard.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert } from "antd";

const VisualizarAgendamento = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const  [ agend, setAgend ] = useState(location.state.agendamento);

  const [mensagemAlerta, setMensagemAlerta] = useState(null);
  const {
    register,
    handleSubmit,
    subscribe,
    reset,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  const [ petSel, setPetSel ] = useState('');
  const [clientes, setClientes] = useState([]);
  const [incluirBuscar, setIncluirBuscar] = useState(false);
  const [devolverMesmo, setDevolverMesmo] = useState(false);
  const [incluirDevolver, setIncluirDevolver] = useState(false);
  const [petsCliente, setPetsCliente] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [petsSel, setPetsSel] = useState([]);
  const [preco, setPreco] = useState({
    precoServico: 0,
    precoPet: 0,
    precoTotal: 0,
  });
  const [servicoSel, setServicoSel] = useState({});
  const [funcionarios, setFuncionarios] = useState([]);
  const { empresaFetch, validar } = useAuth();
  const [cepBuscar, setCepBuscar] = useState("");
  const [cepDevolver, setCepDevolver] = useState("");


  // Lógica de cálculo de preços
  async function popularPreco() {
    const idServ = servicoSel;

    if (Number.isInteger(idServ) && idServ != 0) {
      const resp = await empresaFetch(`/servico-oferecido/${idServ}`);

      if (resp.status != 200) {
        return;
      }

      const jsonBody = await resp.json();
      const { preco: precoObtido, tipoPreco } = jsonBody.servicoOferecido;

      let pets = 0,
        servico = 0,
        total = 0;
      if (tipoPreco == "pet") {
        pets = precoObtido;
        total = pets * petsSel.length;
      } else if (tipoPreco == "servico") {
        servico = precoObtido;
        total = servico;
      }

      setPreco({ precoPet: pets, precoServico: servico, precoTotal: total });
    } else {
      setPreco({ precoPet: 0, precoServico: 0, precoTotal: 0 });
    }
  }

  useEffect(() => {
    popularPreco();
  }, [petsSel, servicoSel]);

  async function popularServicosOferecidos() {
    empresaFetch("/servico-oferecido")
      .then((res) => res.json())
      .then((data) => {
        setServicos(data.servicosOferecidos);
      })
      .catch((error) => {
        console.error("Erro ao buscar serviçoes oferecidos:", error);
      });
  }

  async function popularClientes() {
    empresaFetch("/cliente?query=&option=nome&ordenacao=ascending")
      .then((res) => res.json())
      .then((data) => {
        setClientes(data.clientes);
      })
      .catch((error) => {
        console.error("Erro ao buscar Clientes:", error);
      });
  }

  async function popularPetsCliente(id) {
    empresaFetch(`/pet?idCliente=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPetsCliente(data.pets);
      })
      .catch((error) => {
        console.error("Erro ao buscar Clientes:", error);
      });
  }

  async function popularFuncionarios() {
    empresaFetch("/funcionario")
      .then((res) => res.json())
      .then((data) => {
        setFuncionarios(data.funcionarios);
      })
      .catch((error) => {
        console.error("Erro ao buscar Funcionarios:", error);
      });
  }

  useEffect(() => {
    console.log("agend: ", agend);

    if (validar) {
      popularServicosOferecidos();
      popularClientes();
      popularFuncionarios();
    }
  }, []);


  useEffect(() => {
    setServicoSel(agend.servico.id);
  }, [ servicos ]);

  useEffect(() => {
    if (agend) {
      const hora = agend.dtHrMarcada?.split(" ")[1]
      setValue("hora", hora)
      setValue('observacoes', agend.observacoes);

      if (agend.enderecos?.length > 0) {
        const mesmo = agend.enderecos.find( e => e.tipo == "buscar-devolver");

        let buscar;
        let devolver;

        if (mesmo) {
          buscar = devolver = mesmo;
          setDevolverMesmo(true);
        } else {
          setDevolverMesmo(false);
          buscar = agend.enderecos.find( e => e.tipo == "buscar");
          devolver = agend.enderecos.find( e => e.tipo == "devolver");
        }
        
        if (buscar) {
          console.log('true')
          document.getElementById("buscarChk").checked = true;
          setValue("enderecoBuscar", buscar);
        } else {
          document.getElementById("buscarChk").checked = false;
          setIncluirBuscar(false);

        }
        
        if (devolver) {
          setIncluirDevolver(true);
          document.getElementById("devolverChk").checked = true;
          setValue("enderecoDevolver", devolver);
        } else {
          document.getElementById("devolverChk").checked = false;
          setIncluirBuscar(false);
        }
        
      }
    }

  }, [agend]);

  useEffect(() => {
    setValue('funcionario', agend.funcionario?.id);
  }, [ funcionarios ] )

  useEffect(() => {
    popularPetsCliente(agend.cliente?.id);

    setValue('cliente', agend.cliente?.id);
  }, [ clientes ]);

  useEffect(() => {
    const pets = agend.pets.flatMap(p => {
      const encontrado = petsCliente.find(pc => pc.id == p.id); 

      if (encontrado) {
        return encontrado;
      } else {
        return [];
      }
    });

    console.log("pets: ", pets);
    setPetsSel(pets);
  }, [ petsCliente ]);

  return (
    <>
      <div className="containergeral mt-1">
        <h1 className="cadastrar_agendamento__title">Visualizar agendamento</h1>
        <hr />
        <Container className="cadatrar_agendamento mt-4">
          <Form>
            <Row>
              <Col className="campos-espaco">
                <Form.Group controlId="formFiltro" className="form-servico">
                  <Form.Label>Filtrar serviço por:</Form.Label>
                  <Form.Select disabled={true} {...register("filtro")}>
                    <option value="">Sem filtro</option>
                    <option value="">Restrição de espécie</option>
                    <option value="">Restrição de participantes</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col className="campos-espaco">
                <Form.Group controlId="formServico">
                  <Form.Label>Tipo do filtro:</Form.Label>
                  <Form.Select disabled={true} {...register("tipoFiltro")}>
                    <option value="">N/A</option>
                    <option value="">Cães</option>
                    <option value="">Gatos</option>
                    <option value="">Pássaros</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col className="">
                <Form.Group className="" controlId="formServico">
                  <Form.Label>Serviço:<span className="obrigatorio">*</span></Form.Label>
                  <Form.Select
                    disabled={true}
                    value={servicoSel}
                    {...register("servico", {
                      required: {
                        value: true,
                        message: "Selecione o serviço para o agendamento",
                      },
                    })}
                    onInput={(e) => {
                      // const novoServ = getValues('servico')
                      const novoServ = e.target.value;
                      setServicoSel(+novoServ);
                    }}
                  >
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
              <Col className="campos-espaco">
                <Form.Group controlId="formData" className="">
                  <Form.Label>Data do agendamento:<span className="obrigatorio">*</span></Form.Label>
                  <Form.Control
                    disabled={true}
                    type="date"
                    {...register("data", { required: true })}
                    defaultValue={new Date(agend.dtHrMarcada).toISOString().split("T")[0]}
                  />
                </Form.Group>
              </Col>
              <Col className="campos-espaco">
                <Form.Group controlId="formHora">
                  <Form.Label>Hora do agendamento:<span className="obrigatorio">*</span></Form.Label>
                  <Form.Control
                    disabled={true}
                    type="time"
                    {...register("hora", { required: true })}
                    defaultValue={agend.dtHrMarcada.split("T")[1]}
                  />
                </Form.Group>
              </Col>
              <Col className="">
                <Form.Group controlId="formFuncionario">
                  <Form.Label>Funcionário:</Form.Label>
                  <Form.Select 
                    disabled={true}
                    {...register("funcionario")}>
                    <option value="">Selecione um funcionário</option>
                    {funcionarios &&
                      funcionarios.map((funcionario) => (
                        <option key={funcionario.id} value={funcionario.id}>
                          {funcionario.nome}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col className="campos-espaco">
                <Form.Group>
                  <Form.Label>Preço por pets:</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>R$</InputGroup.Text>
                    <Form.Control
                      className="form-agendamento"
                      type="text"
                      placeholder="Valor por pet"
                      value={preco.precoPet}
                      readOnly={true}
                      disabled={true}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col className="campos-espaco">
                <Form.Group>
                  <Form.Label>Preço do Serviço:</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>R$</InputGroup.Text>
                    <Form.Control
                      className="form-agendamento"
                      type="text"
                      placeholder="Valor do Serviço"
                      value={preco.precoServico}
                      readOnly={true}
                      disabled={true}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col className="">
                <Form.Group>
                  <Form.Label>Preço total:</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>R$</InputGroup.Text>
                    <Form.Control
                      className="form-agendamento"
                      type="text"
                      placeholder="Valor total"
                      value={preco.precoTotal}
                      readOnly={true}
                      disabled={true}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <h2 className="mt-4">Pets participantes</h2>
              <hr></hr>
            </Row>
            <Row className="mt-3">
              <Col className="campos-espaco">
                <Form.Group controlId="formServico">
                  <Form.Label>Cliente:<span className="obrigatorio">*</span></Form.Label>
                  <Form.Select
                    disabled={true}
                    onInput={(e) => {
                      popularPetsCliente(e.target.value);
                      setPetsSel([]);
                    }}
                    {...register("cliente", { required: true })}
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes &&
                      clientes.map((cli) => (
                        <option key={cli.id} value={cli.id}>
                          {cli.nome}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col className="campos-espaco">
                <Form.Group controlId="formServico">
                  <Form.Label>Pet:<span className="obrigatorio">*</span></Form.Label>
                  <Form.Select id="pet-selecionar" {...register("pet")}
                    disabled={true}
                    onInput={(e) => {
                      setPetSel(e.target.value);
                    }}
                  >
                    <option value="">Selecione um pet</option>
                    {petsCliente &&
                      petsCliente.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.nome}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col className="justify-content-start d-flex align-items-end ">
                <Button
                  className="button-adicionar"
                  type="button"
                  disabled={!petSel}
                  onClick={(e) => {
                    if (petSel) {
                      const petSel = petsCliente.find((p) => {
                        const pelSelecionado =
                          document.getElementById("pet-selecionar").value;
                        return p.id == pelSelecionado;
                      });

                      const jaExiste = petsSel.some((p) => {
                        return p.id == petSel.id;
                      });
    
                      if (!jaExiste) {
                        setPetsSel(petsSel.concat([petSel]));
                      }
                    }

                  }}
                >
                  Adicionar
                </Button>
              </Col>
            </Row>
            {/* Card de pets */}
            <PetServicoCardList petList={petsSel} setPetList={setPetsSel} allowEdit={false} />
            {/* Endereços ======================================================*/}
            <h5>Endereços</h5>
            <hr />
            <Accordion
              className="mt-3 mb-4"
              // defaultActiveKey="0"
              flush
              // alwaysOpen
            >
              <Accordion.Item eventKey="0" className="pet-servico-card-item">
                <Accordion.Header>
                  <Stack direction="horizontal" gap={3}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <FormCheck
                        type="switch"
                        id="buscarChk"
                        disabled={true}
                      ></FormCheck>
                    </Form.Group>
                    <span>Buscar</span>
                  </Stack>
                </Accordion.Header>
                <Accordion.Body>
                  <CamposEndereco
                    setValue={setValue}
                    cep={cepBuscar}
                    setCep={setCepBuscar}
                    formConfigs={{
                      isRequired:
                        incluirBuscar || (devolverMesmo && incluirDevolver),
                    }}
                    register={register}
                    errors={errors}
                    isDisabled={true}
                    prefix={"enderecoBuscar"}
                  />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1" className="pet-servico-card-item">
                <Accordion.Header>
                  <Stack direction="horizontal" gap={3}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <FormCheck
                        type="switch"
                        id="devolverChk"
                        disabled={true}
                      ></FormCheck>
                    </Form.Group>
                    <span>Devolver</span>
                  </Stack>
                </Accordion.Header>
                <Accordion.Body>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <FormCheck
                      type="switch"
                      id="devolverMesmo"
                      label="O mesmo do anterior"
                      checked={devolverMesmo}
                      isDisabled={true}
                      onChange={(e) => {
                        setDevolverMesmo(e.target.checked);
                        if (e.target.checked) {
                          preencherEndereco("enderecoDevolver", {
                            ...getValues("enderecoBuscar"),
                            cep: "",
                          });
                        }
                      }}
                    ></FormCheck>
                  </Form.Group>
                  <CamposEndereco
                    setValue={setValue}
                    cep={cepDevolver}
                    setCep={setCepDevolver}
                    formConfigs={{
                      isRequired: incluirDevolver && !devolverMesmo,
                    }}
                    register={register}
                    errors={errors}
                    prefix={"enderecoDevolver"}
                    isDisabled={true}
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Row style={{marginBottom: "4em"}}>
              <FloatingLabel
                className="mt-4"
                controlId="floatingTextarea2"
                label="Observações"
              >
                <Form.Control
                  as="textarea"
                  disabled={true}
                  placeholder="Deixe aqui uma observação"
                  style={{ height: "150px" }}
                  {...register("observacoes")}
                />
              </FloatingLabel>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default VisualizarAgendamento;
