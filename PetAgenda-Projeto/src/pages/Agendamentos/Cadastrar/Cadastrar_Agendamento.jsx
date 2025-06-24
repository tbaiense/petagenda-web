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
import "./Cadastrar_Agendamento.css";
import { useAuth } from "../../../contexts/UserContext";
import PetServicoCardList from "../../../components/CardPet/PetServicoCardList";
import CamposEndereco from "../../../components/Endereco/CamposEndereco";
import "../../../components/CardPet/PetServicoCard.css";
import { useLocation, useNavigate } from "react-router-dom";

const Agendamento = () => {
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
  const navigate = useNavigate();

  const location = useLocation();

  // Remover pet da lista
  function handleRemove(idPet) {
    setPetsSel(petsSel.filter((p) => p.id != idPet));
  }

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
    empresaFetch("/cliente")
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

  function getData() {
    const formData = { ...getValues() };
    const pets = petsSel;
    let enderecos = [];

    if (formData.enderecoBuscar || formData.enderecoDevolver) {
      let endBuscar;

      if (formData.enderecoBuscar) {
        endBuscar = {
          logradouro: formData.enderecoBuscar.logradouro,
          numero: formData.enderecoBuscar.numero,
          bairro: formData.enderecoBuscar.bairro,
          cidade: formData.enderecoBuscar.cidade,
          estado: formData.enderecoBuscar.estado,
        };
      }

      if (devolverMesmo) {
        enderecos.push({
          tipo: "buscar-devolver",
          ...endBuscar,
        });
      } else {
        if (incluirBuscar) {
          enderecos.push({
            tipo: "buscar",
            ...endBuscar,
          });
        }

        if (incluirDevolver && formData.enderecoDevolver) {
          const endDevolver = {
            logradouro: formData.enderecoDevolver.logradouro,
            numero: formData.enderecoDevolver.numero,
            bairro: formData.enderecoDevolver.bairro,
            cidade: formData.enderecoDevolver.cidade,
            estado: formData.enderecoDevolver.estado,
          };

          enderecos.push({
            tipo: "devolver",
            ...endDevolver,
          });
        }
      }
    }

    if (enderecos.length == 0) {
      enderecos = undefined;
    }

    const agendamentoData = {
      dtHrMarcada: `${formData.data} ${formData.hora}`,
      servico: { id: formData.servico },
      funcionario: formData.funcionario
        ? { id: formData.funcionario }
        : undefined,
      observacoes: formData.observacoes,
      pets: pets,
      enderecos: enderecos,
    };

    return agendamentoData;
  }

  useEffect(() => {
    if (validar) {
      popularServicosOferecidos();
      popularClientes();
      popularFuncionarios();
    }
  }, []);

  useEffect(() => {
    if (servicos?.length > 0 && location.state?.servicoSelecionado) {
      console.log("location: ", location);
      if (location && Number.isInteger(location.state.servicoSelecionado)) {
        setValue("servico", location.state.servicoSelecionado);
        console.log("servico setado!");
      }
    }
  }, [servicos]);

  function handleEnderecoChange(e) {
    const newEnd = { ...endereco };
    newEnd[e.target.name.split(".")[1]] = e.target.value;

    setValue(e.target.name.split(".")[1], e.target.value);
  }

  async function preencherEnderecosCEP(prefix, cep) {
    try {
      const endRes = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      /*
      {
        "cep": "29149-999",
        "logradouro": "Rua...",
        "complemento": "",
        "unidade": "",
        "bairro": "",
        "localidade": "",
        "uf": "ES",
        "estado": "Espírito Santo",
        "regiao": "Sudeste",
        "ibge": "3201308",
        "gia": "",
        "ddd": "27",
        "siafi": "5625"
      }
      */

      if (endRes.status == 200) {
        const jsonBody = await endRes.json();

        if (!jsonBody.erro) {
          const endFound = {
            logradouro: jsonBody.logradouro,
            bairro: jsonBody.bairro,
            numero: "",
            cidade: jsonBody.localidade,
            estado: jsonBody.uf,
          };

          preencherEndereco(prefix, endFound);
        }
      } else {
        throw new Error(
          "Falha ao obter informaçoes de endereço a partir de CEP"
        );
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  function preencherEndereco(prefix, end) {
    const entries = Object.entries(end);

    for (const [key, value] of entries) {
      setValue(`${prefix}.${key}`, value, { shouldTouch: true });
    }
  }

  // Verificação de CEP de busca
  useEffect(() => {
    const callback = subscribe({
      name: ["enderecoBuscar.cep"],
      formState: {
        values: true,
        touchedFields: true,
        isValid: true,
      },
      callback: ({ values }) => {
        if (
          values.enderecoBuscar &&
          values.enderecoBuscar.cep?.length == 8 &&
          values.enderecoBuscar.cep.match(/^\d{5,5}\d{3,3}$/)
        ) {
          const { cep } = values.enderecoBuscar;
          preencherEnderecosCEP("enderecoBuscar", cep);
        }
      },
    });
  }, [subscribe]);

  // Verificação de CEP de devolução
  useEffect(() => {
    const callback = subscribe({
      name: ["enderecoDevolver.cep"],
      formState: {
        values: true,
        touchedFields: true,
        isValid: true,
      },
      callback: ({ values }) => {
        if (
          values.enderecoDevolver &&
          values.enderecoDevolver.cep?.length == 8 &&
          values.enderecoDevolver.cep.match(/^\d{5,5}\d{3,3}$/)
        ) {
          const { cep } = values.enderecoDevolver;
          preencherEnderecosCEP("enderecoDevolver", cep);
        }
      },
    });

    return () => callback();
  }, [subscribe]);

  const onSubmit = async (data) => {
    // Cadastrando agendamento
    try {
      const resp = await empresaFetch("/agendamento", {
        method: "POST",
        body: JSON.stringify(getData()),
      });

      const jsonBody = await resp.json();
      if (jsonBody) {
        if (resp.status == 200) {
          alert("cadastrado!");
          navigate("/empresa/agendamentos/lista");
          reset();
        } else {
          throw new Error(jsonBody.errors[0]);
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="containergeral mt-1">
      <h1 className="cadastrar_agendamento__title">Novo agendamento</h1>
      <hr />
      <Container className="cadatrar_agendamento mt-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col className="campos-espaco">
              <Form.Group controlId="formServico" className="form-servico">
                <Form.Label>Filtrar serviço por:</Form.Label>
                <Form.Select {...register("filtro")}>
                  <option value="">Restrição de espécie</option>
                  <option value="">Todos</option>
                  <option value="">Restrição de participantes</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col className="campos-espaco">
              <Form.Group controlId="formServico">
                <Form.Label>Tipo do filtro:</Form.Label>
                <Form.Select {...register("tipoFiltro")}>
                  <option value="">Cães</option>
                  <option value="">Gatos</option>
                  <option value="">Pássaros</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col className="">
              <Form.Group className="" controlId="formServico">
                <Form.Label>Serviço:</Form.Label>
                <Form.Select
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
                    console.log("rodei: ", novoServ);
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
                <Form.Label>Data do agendamento:</Form.Label>
                <Form.Control
                  type="date"
                  {...register("data", { required: true })}
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </Form.Group>
            </Col>
            <Col className="campos-espaco">
              <Form.Group controlId="formHora">
                <Form.Label>Hora do agendamento:</Form.Label>
                <Form.Control

                  type="time"
                  {...register("hora", { required: true })}
                  defaultValue=""
                />
              </Form.Group>
            </Col>
            <Col className="">
              <Form.Group controlId="formFuncionario">
                <Form.Label>Funcionário:</Form.Label>
                <Form.Select {...register("funcionario")}>
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
                <Form.Label>Cliente:</Form.Label>
                <Form.Select
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
                <Form.Label>Pet:</Form.Label>
                <Form.Select id="pet-selecionar" {...register("pet")}>
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
                onClick={(e) => {
                  let petSelect, petSelecionado;

                  const petSel = petsCliente.find((p) => {
                    petSelect = document.getElementById("pet-selecionar");
                    petSelecionado = petSelect.value;
                    return p.id == petSelecionado;
                  });

                  const jaExiste = petsSel.some((p) => {
                    return p.id == petSel.id;
                  });

                  if (!jaExiste) {
                    setPetsSel(petsSel.concat([petSel]));
                  }
                }}
              >
                Adicionar
              </Button>
            </Col>
          </Row>
          {/* Card de pets */}
          <PetServicoCardList petList={petsSel} setPetList={setPetsSel} />
          {/* Endereços ======================================================*/}
          <h5>Endereços</h5>
          <hr />
          <Accordion
            className="mt-3 mb-4"
            defaultActiveKey="0"
            flush
            alwaysOpen
          >
            <Accordion.Item eventKey="0" className="pet-servico-card-item">
              <Accordion.Header>
                <Stack direction="horizontal" gap={3}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <FormCheck
                      type="switch"
                      id="buscarChk"
                      checked={incluirBuscar}
                      onChange={(e) => {
                        setIncluirBuscar(e.target.checked);
                        if (!e.target.checked && devolverMesmo) {
                          setDevolverMesmo(false);
                        }
                      }}
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
                  handleChange={handleEnderecoChange}
                  formConfigs={{
                    isRequired:
                      incluirBuscar || (devolverMesmo && incluirDevolver),
                  }}
                  register={register}
                  errors={errors}
                  isDisabled={!incluirBuscar}
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
                      checked={incluirDevolver}
                      onChange={(e) => {
                        setIncluirDevolver(e.target.checked);
                        if (!e.target.checked && devolverMesmo) {
                          setDevolverMesmo(false);
                        }
                      }}
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
                    disabled={!incluirDevolver || !incluirBuscar}
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
                  handleChange={handleEnderecoChange}
                  formConfigs={{
                    isRequired: incluirDevolver && !devolverMesmo,
                  }}
                  register={register}
                  errors={errors}
                  prefix={"enderecoDevolver"}
                  isDisabled={!incluirDevolver || devolverMesmo}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion> variant="secondary"
          <Row>
            <FloatingLabel
              className="mt-4"
              controlId="floatingTextarea2"
              label="Observações"
            >
              <Form.Control
                as="textarea"
                placeholder="Deixe aqui uma observação"
                style={{ height: "150px" }}
                {...register("observacoes")}
              />
            </FloatingLabel>
          </Row>
          <Row className="d-flex justify-content-center">
            <Col md="auto">
              <Button
                variant="primary"
                onClick={(e) => {
                  getData();
                }}
                type="submit"
                className="mt-4 mb-4 botao__cadastrar"
              >
                Agendar
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default Agendamento;
