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
import "./Servico_Executado.css";
import { useAuth } from "../../../contexts/UserContext";
import PetServicoCardList from "../../../components/CardPet/PetServicoCardList";
import CamposEndereco from "../../../components/Endereco/CamposEndereco";
import "../../../components/CardPet/PetServicoCard.css";
import { useNavigate } from "react-router-dom";
import { Alert } from "antd";

const ServicoExecutado = () => {

  const [mensagemAlerta, setMensagemAlerta] = useState(null);
  const navigate = useNavigate();
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
  const [petsCliente, setPetsCliente] = useState([]);
  const [petsSel, setPetsSel] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [incluirBuscar, setIncluirBuscar] = useState(false);
  const [incluirDevolver, setIncluirDevolver] = useState(false);
  const [devolverMesmo, setDevolverMesmo] = useState(false);
  const { empresaFetch, validar } = useAuth();

  const [preco, setPreco] = useState({
    precoServico: 0,
    precoPet: 0,
    precoTotal: 0,
  });
  const [servicoSel, setServicoSel] = useState({});

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
      if (devolverMesmo) {
        const { logradouro, numero, bairro, cidade, estado } =
          formData.enderecoBuscar;

        enderecos.push({
          tipo: "buscar-devolver",
          logradouro: logradouro,
          numero: numero,
          bairro: bairro,
          cidade: cidade,
          estado: estado,
        });
      } else {
        if (incluirBuscar) {
          const { logradouro, numero, bairro, cidade, estado } =
            formData.enderecoBuscar;

          enderecos.push({
            tipo: "buscar",
            logradouro: logradouro,
            numero: numero,
            bairro: bairro,
            cidade: cidade,
            estado: estado,
          });
        }

        if (incluirDevolver) {
          const { logradouro, numero, bairro, cidade, estado } =
            formData.enderecoBuscar;

          enderecos.push({
            tipo: "devolver",
            logradouro: logradouro,
            numero: numero,
            bairro: bairro,
            cidade: cidade,
            estado: estado,
          });
        }
      }
    }

    if (enderecos.length == 0) {
      enderecos = undefined;
    }

    const servicoData = {
      inicio: `${formData.dataExecucao} ${formData.horaInicio}`,
      fim: `${formData.dataExecucao} ${formData.horaFim}`,
      servico: { id: formData.servico },
      funcionario: formData.funcionario
        ? { id: formData.funcionario }
        : undefined,
      observacoes: formData.observacoes,
      pets: pets,
      enderecos: enderecos,
    };

    return servicoData;
  }

  useEffect(() => {
    if (validar) {
      popularServicosOferecidos();
      popularClientes();
      popularFuncionarios();
    }
  }, []);

  function handleEnderecoChange(e) {
    const newEnd = { ...endereco };
    newEnd[e.target.name.split(".")[1]] = e.target.value;

    setEndereco(newEnd);
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

          const entries = Object.entries(endFound);

          for (const [key, value] of entries) {
            setValue(`${prefix}.${key}`, value, { shouldTouch: true });
          }
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
      const resp = await empresaFetch("/servico-realizado", {
        method: "POST",
        body: JSON.stringify(getData()),
      });

      const jsonBody = await resp.json();
      if (jsonBody) {
        if (resp.status == 200) {
          setMensagemAlerta({
            titulo: "Serviço realizado com sucesso!",
            descricao: "O serviço foi agendado corretamente.",
            tipo: "success",
          });
          setTimeout(() => {
            setMensagemAlerta(null);
          }, 2500);
          navigate("/empresa/agendamentos/lista", {
            state: {
              sucessoServicoRealizado: true,
            },
          });
          reset();
        } else {
          setMensagemAlerta({
            titulo: "Erro ao cadastrar serviço realizado",
            descricao:
              jsonBody.message ||
              "Ocorreu um erro ao tentar cadastrar o serviço.",
            tipo: "error",
          });
          setTimeout(() => {
            setMensagemAlerta(null);
          }, 2500);
        }
      }
    } catch (err) {
      setMensagemAlerta({
        titulo: "Erro ao cadastrar serviço realizado",
        descricao:
          err.message || "Ocorreu um erro ao tentar cadastrar o serviço.",
        tipo: "error",
      });
      setTimeout(() => {
        setMensagemAlerta(null);
      }, 2500);
    }
  };

  return (
    <div className="containergeral mt-1">
      {mensagemAlerta && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: "fit-content",
            maxWidth: "90vw",
          }}
        >
          <Alert
            message={mensagemAlerta.titulo}
            description={mensagemAlerta.descricao}
            type={mensagemAlerta.tipo}
            showIcon
            style={{
              fontSize: "12px",
              padding: "8px 12px",
              lineHeight: "1.2",
            }}
          />
        </div>
      )}
      <h1 className="cadastrar_agendamento__title">Novo Serviço Realizado</h1>
      <hr />
      <Container className="cadatrar_agendamento mt-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
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
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Serviço<span className="obrigatorio">*</span></Form.Label>
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
              <Form.Group controlId="dataExecucao">
                <Form.Label>Data de execução<span className="obrigatorio">*</span></Form.Label>
                <Form.Control
                  type="date"
                  {...register("dataExecucao", { required: true })}
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </Form.Group>
            </Col>
            <Col className="campos-espaco">
              <Form.Group controlId="horaInicio">
                <Form.Label>Hora de início<span className="obrigatorio">*</span></Form.Label>
                <Form.Control
                  type="time"
                  {...register("horaInicio", { required: true })}
                  // defaultValue={new Date().toTimeString().slice(0, 5)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="horaFim">
                <Form.Label>Hora de finalização<span className="obrigatorio">*</span></Form.Label>
                <Form.Control
                  type="time"
                  {...register("horaFim", { required: true })}
                  defaultValue={new Date().toTimeString().slice(0, 5)}
                />
              </Form.Group>
            </Col>
          </Row>
          {/* Preços */}
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
                <Form.Label>Preço total</Form.Label>
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

          <Row className="mt-3">
            <Col md={5}>
              <Form.Group controlId="formFuncionario">
                <Form.Label>Funcionário que realizou<span className="obrigatorio">*</span></Form.Label>
                <Form.Select
                  {...register("funcionario", {
                    required: {
                      value: true,
                      message: "Selecione o funcionário atribuído",
                    },
                  })}
                >
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

          <Row>
            <h2 className="mt-4">Pets participantes</h2>
            <hr></hr>
          </Row>
          <Row className="mt-3">
            <Col className="campos-espaco">
              <Form.Group controlId="formServico">
                <Form.Label>Cliente:<span className="obrigatorio">*</span></Form.Label>
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
                <Form.Label>Pet:<span className="obrigatorio">*</span></Form.Label>
                <Form.Select id="pet-selecionar" {...register("pet")}
                  disabled={!getValues('cliente')}
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

          <PetServicoCardList petList={petsSel} setPetList={setPetsSel} />

          <h5 className="mt-4">Endereços</h5>
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
                      onChange={(e) => {
                        setIncluirBuscar(e.target.checked);
                      }}
                    ></FormCheck>
                  </Form.Group>
                  <span>Buscar</span>
                </Stack>
              </Accordion.Header>
              <Accordion.Body>
                <CamposEndereco
                  setValue={setValue}
                  handleChange={handleEnderecoChange}
                  formConfigs={{ isRequired: incluirBuscar }}
                  register={register}
                  errors={errors}
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
                      onChange={(e) => {
                        setIncluirDevolver(e.target.checked);
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
                    onChange={(e) => {
                      setDevolverMesmo(e.target.checked);
                    }}
                  ></FormCheck>
                </Form.Group>
                <CamposEndereco
                  setValue={setValue}
                  handleChange={handleEnderecoChange}
                  formConfigs={{ isRequired: incluirDevolver }}
                  register={register}
                  errors={errors}
                  prefix={"enderecoDevolver"}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
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
                Cadastrar
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default ServicoExecutado;
