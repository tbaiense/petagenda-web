import React, { useState } from "react";
import PetServicoCardList from "../../../components/CardPet/PetServicoCardList";
import styles from "./EditarServicoExecutavel.module.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/UserContext";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  FormCheck,
  InputGroup,
  Accordion,
  Stack,
  FloatingLabel,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import CamposEndereco from "../../../components/Endereco/CamposEndereco";

const EditarServicoExecutavel = () => {
  const locate = useLocation();
  const { empresaFetch, validar } = useAuth();
  const [servicoSel, setServicoSel] = useState({});
  const [servicoEscolhido, setServicoEscolhido] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [petsCliente, setPetsCliente] = useState([]);
  const [petsSel, setPetsSel] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [incluirBuscar, setIncluirBuscar] = useState(false);
  const [incluirDevolver, setIncluirDevolver] = useState(false);
  const [devolverMesmo, setDevolverMesmo] = useState(false);
  const [preco, setPreco] = useState({
    precoServico: 0,
    precoPet: 0,
    precoTotal: 0,
  });
  const [dataHora, setDataHora] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [horainicio, setHoraInicio] = useState("");
  const [servicoRealizado, setServicoRealizado] = useState();
  const { id } = locate.state
  const [idPet, setIdPet] = useState("");
  const [idCliente, setIdCliente] = useState("");
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

  const enderecoBuscar = servicoRealizado?.enderecos?.find(
    (end) => end.tipo === "buscar"
  )

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
    getServicoExecutado(id);
  }, []);



  useEffect(() => {
    popularFuncionarios()
    popularServicosOferecidos()
  }, [servicoRealizado]);

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
    if (servicoRealizado) {
      console.log("Recebido: ", servicoRealizado);

      const data = servicoRealizado?.fim.split(" ")[0]
      setDataHora(data);
      setValue("dataExecucao", data)

      const hFim = servicoRealizado?.fim.split(" ")[1]
      setHoraFim(hFim)
      setValue("horaFim", hFim)

      const hInicio = servicoRealizado?.inicio?.split(" ")[1]
      setHoraInicio(hInicio)
      setValue("horaInicio", hInicio)

      getServicoOferecido(servicoRealizado?.servico?.id)

      popularPetsCliente(servicoRealizado?.cliente?.id)

    }

  }, [servicoRealizado]);

  async function getServicoExecutado(id) {
    const resp = await empresaFetch(`/servico-realizado/${id}`);
    const jsonBody = await resp.json();
    setServicoRealizado(jsonBody.servicoRealizado)
  }

  async function getServicoOferecido(id) {
    const resp = await empresaFetch(`/servico-oferecido/${id}`)
    const jsonBody = await resp.json()
    console.log("Servico oferecido:", jsonBody)
    setServicoEscolhido(jsonBody.servicoOferecido);
  }

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
  useEffect(() => {
    if (servicoRealizado?.observacoes) {
      setValue("observacoes", servicoRealizado.observacoes);
    }
  }, [servicoRealizado, setValue]);


  const onSubmit = async (data) => {
    // editar servico executado
    console.log("Eu cheguei ate aqui!")
    try {
      console.log("Entrei no try")
      console.log("aqui é o JSON:", JSON.stringify(getData()))
      const resp = await empresaFetch("/servico-realizado", {
        method: "PUT",
        body: JSON.stringify(getData()),
      });

      const jsonBody = await resp.json();
      if (jsonBody) {
        if (resp.status == 200) {
          alert("editado!");
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
      <h1 className="cadastrar_agendamento__title">Editar Serviço Realizado</h1>
      <hr />
      <Container className="cadatrar_agendamento mt-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col className="campos-espaco">
              <Form.Group controlId="formFiltro" className="form-servico">
                <Form.Label>Filtrar serviço por:</Form.Label>
                <Form.Select {...register("filtro")} disabled>
                  <option value="">Restrição de espécie</option>
                  <option value="">Todos</option>
                  <option value="">Restrição de participantes</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col className="campos-espaco">
              <Form.Group controlId="formServico">
                <Form.Label>Tipo do filtro:</Form.Label>
                <Form.Select {...register("tipoFiltro")} disabled>
                  <option value="">Cães</option>
                  <option value="">Gatos</option>
                  <option value="">Pássaros</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Serviço</Form.Label>
                <Form.Select
                  value={servicoEscolhido?.id}
                  {...register("servico")}
                  disabled
                >
                  <option value="">{servicoEscolhido?.nome || "Carregando"}</option>
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
                <Form.Label>Data de execução</Form.Label>
                <Form.Control
                  type="date"
                  {...register("dataExecucao", { required: true })}
                  value={dataHora}
                  onChange={(e) => {
                    setDataHora(e.target.value);
                    setValue("dataExecucao", e.target.value)
                  }}
                />
              </Form.Group>
            </Col>
            <Col className="campos-espaco">
              <Form.Group controlId="horaInicio">
                <Form.Label>Hora de início</Form.Label>
                <Form.Control
                  type="time"
                  {...register("horaInicio", { required: true })}
                  value={(horainicio || "").slice(0, 5)}
                  onChange={(e) => {
                    setHoraInicio(e.target.value)
                    setValue("horaInicio", e.target.value)

                  }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="horaFim">
                <Form.Label>Hora de finalização</Form.Label>
                <Form.Control
                  type="time"
                  {...register("horaFim", { required: true })}
                  value={(horaFim || "").slice(0, 5)}
                  onChange={(e) => {
                    setHoraFim(e.target.value)
                    setValue("horaFim", e.target.value)
                  }}
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
                    value={servicoRealizado?.valor?.pets}
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
                    value={servicoRealizado?.valor.servico}
                    readOnly={true}
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
                    value={servicoRealizado?.valor.total}
                    readOnly={true}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={5}>
              <Form.Group controlId="formFuncionario">
                <Form.Label>Funcionário que realizou</Form.Label>
                <Form.Select
                  {...register("funcionario", {
                    required: {
                      value: true,
                      message: "Selecione o funcionário atribuído",
                    },
                  })}
                  defaultValue={servicoRealizado?.funcionario?.id || ""}
                >
                  <option value={servicoRealizado?.funcionario?.id}>{servicoRealizado?.funcionario?.nome || ""}</option>
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
                <Form.Label>Cliente:</Form.Label>
                <Form.Select
                  onInput={(e) => {
                    popularPetsCliente(e.target.value);
                    setPetsSel([]);
                  }}
                  {...register("cliente",)}
                  disabled>
                  <option>{servicoRealizado?.cliente?.nome}</option>
                  {clientes &&
                    clientes.map((cli) => (
                      <option key={cli.id} value={servicoRealizado?.cliente?.nome}>
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
                  endereco={enderecoBuscar ?? {}}
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
                Editar
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default EditarServicoExecutavel;
