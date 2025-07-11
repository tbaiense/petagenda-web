import React, { useState, useEffect } from "react";
import Stack from "react-bootstrap/Stack";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Container, Form, Row, Col, Button, FormCheck } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./Editar_Agendamento.css";
import { useAuth } from "../../../contexts/UserContext";
import PetServicoCardList from "../../../components/CardPet/PetServicoCardList";
import CamposEndereco from "../../../components/Endereco/CamposEndereco";
import "../../../components/CardPet/PetServicoCard.css";
import { useLocation } from "react-router-dom";
import { set } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Alert } from "antd";
function Editar_Agendamento() {
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

  const [clientes, setClientes] = useState([]);
  const [incluirBuscar, setIncluirBuscar] = useState(false);
  const [devolverMesmo, setDevolverMesmo] = useState(false);
  const [incluirDevolver, setIncluirDevolver] = useState(false);
  const [petsCliente, setPetsCliente] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [petsSel, setPetsSel] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const { empresaFetch, validar } = useAuth();
  const location = useLocation();

  function handleRemove(idPet) {
    setPetsSel(petsSel.filter((p) => p.id != idPet));
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

    setEndereco(newEnd);
    setValue(e.target.name.split(".")[1], e.target.value);
  }

  async function preencherEnderecosCEP(prefix, cep) {
    try {
      const endRes = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

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
      const resp = await empresaFetch("/agendamento/:id", {
        method: "PUT",
        body: JSON.stringify(getData()),
      });

      const jsonBody = await resp.json();
      if (jsonBody) {
        if (resp.status == 200) {
          setMensagemAlerta({
            tipo: "success",
            titulo: "Agendamento atualizado com sucesso!",
            descricao: "Redirecionando para a lista de agendamentos...",
          });
          setTimeout(() => {
            setMensagemAlerta(null);
            navigate("/empresa/agendamentos/lista");
          }, 2500);
          reset();
        } else {
          throw new Error(jsonBody.errors[0]);
        }
      }
    } catch (err) {
      console.error("Erro ao atualizar agendamento:", err);
      setMensagemAlerta({
        tipo: "error",
        titulo: "Erro ao atualizar agendamento",
        descricao: err.message || "Ocorreu um erro ao atualizar o agendamento.",
      });
      setTimeout(() => {
        setMensagemAlerta(null);
      }, 2500);
    }
  };

  return (
    <>
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
      <div className="containergeral mt-1">
        <h1 className="cadastrar_agendamento__title">Novo agendamento</h1>
        <hr />
        <Container className="cadatrar_agendamento mt-4">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col className="campos-espaco">
                <Form.Group controlId="formServico" className="form-servico">
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
                    {...register("servico", {
                      required: {
                        value: true,
                        message: "Selecione o serviço para o agendamento",
                      },
                    })}
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
                <Form.Group controlId="formData">
                  <Form.Label>Data do agendamento</Form.Label>
                  <Form.Control
                    type="date"
                    {...register("data", { required: true })}
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </Form.Group>
              </Col>
              <Col className="campos-espaco">
                <Form.Group controlId="formHora">
                  <Form.Label>Hora do agendamento</Form.Label>
                  <Form.Control
                    type="time"
                    {...register("hora", { required: true })}
                    defaultValue=""
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formFuncionario">
                  <Form.Label>Funcionário</Form.Label>
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
              {/* Voltar */}
              <Col md="auto" className="campos-espaco">
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigate("/empresa/agendamentos/lista");
                    console.log("Voltar para agendamentos");
                  }}
                  className="mt-4 mb-4 botao__cancelar"
                  type="button"
                >
                  Cancelar
                </Button>
              </Col>
              <Col md="auto">
                <Button
                  variant="primary"
                  onClick={(e) => {
                    getData();
                  }}
                  type="submit"
                  className="mt-4 mb-4 botao__cadastrar"
                >
                  Salvar
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
}

export default Editar_Agendamento;
