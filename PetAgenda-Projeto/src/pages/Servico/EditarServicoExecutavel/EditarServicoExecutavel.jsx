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
  const [servicoEscolhido, setServicoEscolhido] = useState();
  const {id} = locate.state
  console.log("Esse é o id:",id)

  function handleEnderecoChange(e) {
    const newEnd = { ...endereco };
    newEnd[e.target.name.split(".")[1]] = e.target.value;

    setEndereco(newEnd);
    setValue(e.target.name.split(".")[1], e.target.value);
  }

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
  useEffect(() => {
    getServicoExecutado(id);
  }, []);

  async function getServicoExecutado(id) {
    const limit = 6;
    const resp = await empresaFetch(`/servico-realizado/${id}`);
    const jsonBody = await resp.json();
    setServicoEscolhido(jsonBody)
    console.log("Recebido: ", servicoEscolhido);
  }

  const onSubmit = async (data) => {
    // editar servico executado
    try {
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
                  disabled
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
                <Form.Label>Data de execução</Form.Label>
                <Form.Control
                  type="date"
                  {...register("dataExecucao", { required: true })}
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </Form.Group>
            </Col>
            <Col className="campos-espaco">
              <Form.Group controlId="horaInicio">
                <Form.Label>Hora de início</Form.Label>
                <Form.Control
                  type="time"
                  {...register("horaInicio", { required: true })}
                  defaultValue={new Date().toTimeString().slice(0, 5)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="horaFim">
                <Form.Label>Hora de finalização</Form.Label>
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
                <Form.Label>Preço total</Form.Label>
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
                <Form.Label>Cliente:</Form.Label>
                <Form.Select
                  onInput={(e) => {
                    popularPetsCliente(e.target.value);
                    setPetsSel([]);
                  }}
                  {...register("cliente", { required: true })}
                >
                  <option value={servicoEscolhido?.cliente?.nome}>{servicoEscolhido?.cliente?.nome}</option>
                  {clientes &&
                    clientes.map((cli) => (
                      <option key={cli.id} value={servicoEscolhido.cliente.nome}>
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
                Agendar
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default EditarServicoExecutavel;
