import React, { useState, useEffect } from "react";
import Stack from 'react-bootstrap/Stack';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Container, Form, Row, Col, Button, FormCheck } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./Cadastrar_Agendamento.css";
import { useAuth } from "../../../contexts/UserContext";
import PetServicoCardList from "../../../components/CardPet/PetServicoCardList";
import CamposEndereco from "../../../components/Endereco/CamposEndereco";
import "../../../components/CardPet/PetServicoCard.css";

const Agendamento = () => {
  const { register, handleSubmit, subscribe, reset, watch, formState: { errors }, setValue, getValues } = useForm();
  const [ clientes, setClientes ] = useState([]);
  const [ incluirBuscar, setIncluirBuscar ] = useState(false);
  const [ devolverMesmo, setDevolverMesmo ] = useState(false);
  const [ incluirDevolver, setIncluirDevolver ] = useState(false);
  const [ petsCliente, setPetsCliente ] = useState([]);
  const [ servicos, setServicos ] = useState([]);
  const [ petsSel, setPetsSel ] = useState([]);
  const [ funcionarios, setFuncionarios ] = useState([]);
  const { empresaFetch, validar } = useAuth();

  // Remover pet da lista
  function handleRemove(idPet) {
    setPetsSel(petsSel.filter( p => (p.id != idPet)));
  }

  async function popularServicosOferecidos() {
    empresaFetch('/servico-oferecido')
      .then(res => res.json())
      .then(data => {
        setServicos(data.servicosOferecidos);
      })
      .catch(error => {
          console.error("Erro ao buscar serviçoes oferecidos:", error);
      });
  }

  async function popularClientes() {
    empresaFetch('/cliente')
      .then(res => res.json())
      .then(data => {
          setClientes(data.clientes);
      })
      .catch(error => {
          console.error("Erro ao buscar Clientes:", error);
      });
  }

  async function popularPetsCliente() {
    empresaFetch(`/pet?idCliente=${watch("cliente")}`)
      .then(res => res.json())
      .then(data => {
          setPetsCliente(data.pets);
      })
      .catch(error => {
          console.error("Erro ao buscar Clientes:", error);
      });
  }

  async function popularFuncionarios() {
    empresaFetch('/funcionario')
      .then(res => res.json())
      .then(data => {
          setFuncionarios(data.funcionarios);
      })
      .catch(error => {
          console.error("Erro ao buscar Funcionarios:", error);
      });

  }

  function getData() {
    const formData = {...getValues()};
    const pets = petsSel;
    let enderecos = [];

    if (formData.enderecoBuscar || formData.enderecoDevolver) {
      if (devolverMesmo) {
        const {
          logradouro,
          numero,
          bairro,
          cidade,
          estado,
        } = formData.enderecoBuscar;

        enderecos.push(
          {
            tipo: "buscar-devolver",
            logradouro: logradouro,
            numero: numero,
            bairro: bairro,
            estado: estado
          }
        );
      } else {
        if (incluirBuscar) {
          const {
            logradouro,
            numero,
            bairro,
            cidade,
            estado,
          } = formData.enderecoBuscar;
  
          enderecos.push(
            {
              tipo: "buscar",
              logradouro: logradouro,
              numero: numero,
              bairro: bairro,
              estado: estado
            }
          );
        }

        if (incluirDevolver) {
          const {
            logradouro,
            numero,
            bairro,
            cidade,
            estado,
          } = formData.enderecoBuscar;
  
          enderecos.push(
            {
              tipo: "devolver",
              logradouro: logradouro,
              numero: numero,
              bairro: bairro,
              estado: estado
            }
          );
        }
      }
    }

    if (enderecos.length == 0) {
      enderecos = undefined;
    }

    const agendamentoData = {
      dtHrMarcada: `${formData.data} ${formData.hora}`,
      servico: { id: formData.servico },
      funcionario: (formData.funcionario) ? { id: formData.funcionario } : undefined,
      observacoes: formData.observacoes,
      pets: pets,
      enderecos: enderecos
    };

    console.log(agendamentoData);
    return {
      // dtHrMarcada: "",
      // servico: { id: 0 },
      // funcionario: { id: 0 },
      // observacoes: "",
      // pets : [
      //     {
      //         id: 0,
      //         alimentacao: "",
      //         remedios: [
      //             { nome: "", instrucoes: ""}
      //         ]
      //     }
      // ],
      // enderecos: [
      //     {
      //         tipo: "buscar",
      //         logradouro: "",
      //         numero: "",
      //         bairro: "",
      //         cidade: "",
      //         estado: ""
      //     },
      //     {
      //       tipo: "devolver",
      //       logradouro: "",
      //       numero: "",
      //       bairro: "",
      //       cidade: "",
      //       estado: ""
      //   }
      // ]
    }
  }

  useEffect(() => {
    if (validar) {
      popularServicosOferecidos();
      popularClientes();
      popularPetsCliente();
      popularFuncionarios();
    }
  }, []);

  function handleEnderecoChange(e) {
    const newEnd = {...endereco };
    newEnd[e.target.name.split('.')[1]] = e.target.value;
    
    setEndereco(newEnd);
    setValue(e.target.name.split('.')[1], e.target.value);
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
        console.log('fetch cep');

        const jsonBody = await endRes.json();
        if (!jsonBody.erro) {
          const endFound = {
            logradouro: jsonBody.logradouro,
            bairro: jsonBody.bairro,
            numero: "",
            cidade: jsonBody.localidade,
            estado: jsonBody.uf,
          }
  
          const entries = Object.entries(endFound);
  
          for (const [key, value] of entries) {
            setValue(`${prefix}.${key}`, value, { shouldTouch: true });
          }
        }
      } else {
        throw new Error("Falha ao obter informaçoes de endereço a partir de CEP");
      }
    } catch (err) {
      console.error(err.message);
    }
  }


  // Verificação de CEP de busca
  useEffect(() => {
    const callback = subscribe({
      name: [ "enderecoBuscar.cep" ],
      formState: {
        values: true,
        touchedFields: true,
        isValid: true
      },
      callback: ({values}) => {
        if (values.enderecoBuscar && values.enderecoBuscar.cep?.length == 8 && values.enderecoBuscar.cep.match(/^\d{5,5}\d{3,3}$/)) {
          const { cep } = values.enderecoBuscar;
          preencherEnderecosCEP("enderecoBuscar", cep);
        }
      }
    });
  }, [subscribe]);

  // Verificação de CEP de devolução
  useEffect(() => {
    const callback = subscribe({
      name: [ "enderecoDevolver.cep" ],
      formState: {
        values: true,
        touchedFields: true,
        isValid: true
      },
      callback: ({values}) => {
        if (values.enderecoDevolver && values.enderecoDevolver.cep?.length == 8 && values.enderecoDevolver.cep.match(/^\d{5,5}\d{3,3}$/)) {
          const { cep } = values.enderecoDevolver;
          preencherEnderecosCEP("enderecoDevolver", cep);
        }
      }
    });

    return () => callback();

  }, [subscribe]);

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <div className="cadatrar_agendamento mt-4">
      <h2 className="cadastrar_agendamento__title">Novo agendamento</h2>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Filtrar serviço por:</Form.Label>
                <Form.Select {...register("filtro")}>
                  <option value="">Restrição de espécie</option>
                  <option value="">Todos</option>
                  <option value="">Restrição de participantes</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Tipo do filtro:</Form.Label>
                <Form.Select {...register("tipoFiltro")}>
                  <option value="">Cães</option>
                  <option value="">Gatos</option>
                  <option value="">Pássaros</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Serviço</Form.Label>
                <Form.Select {...register("servico")}>
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
            <Col>
              <Form.Group controlId="formData">
                <Form.Label>Data do agendamento</Form.Label>
                <Form.Control
                  type="date"
                  {...register("data", { required: true })}
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formHora">
                <Form.Label>Hora do agendamento</Form.Label>
                <Form.Control
                  type="time"
                  {...register("hora", { required: true })}
                  defaultValue="09:00"
                />
              </Form.Group>
            </Col>
             <Col>
              <Form.Group controlId="formFuncionario">
                <Form.Label>Funcionário</Form.Label>
                <Form.Select {...register("funcionario")}>
                  <option value="">Selecione um funcionário</option>
                  {funcionarios && funcionarios.map((funcionario) => (
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
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Cliente:</Form.Label>
                <Form.Select {...register("cliente", { required: true })}>
                  <option value="">Selecione um cliente</option>
                  {clientes && clientes.map((cli) => (
                    <option key={cli.id} value={cli.id}>
                      {cli.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formServico">
                <Form.Label>Pet:</Form.Label>
                <Form.Select id="pet-selecionar" {...register("pet")}>
                  <option value="">Selecione um pet</option>
                  {petsCliente && petsCliente.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Button 
                variant="secondary" 
                type="button"
                onClick={
                  e => {
                    const petSel = petsCliente.find( p => {
                      const pelSelecionado = document.getElementById('pet-selecionar').value;
                      return (p.id == pelSelecionado);
                    });

                    const jaExiste = petsSel.some( p => {
                      return p.id == petSel.id;
                    });

                    if (!jaExiste) {
                      setPetsSel(petsSel.concat([petSel]));
                    }
                  }
                }
              >
                Adicionar
              </Button>
            </Col>
          </Row>
          {/* Card de pets */}
          <PetServicoCardList petList={petsSel} handleRemove={handleRemove}/>
          {/* Endereços ======================================================*/}
          <h5>Endereços</h5>
          <hr />
          <Accordion className="mt-3 mb-4" defaultActiveKey="0" flush alwaysOpen>
            <Accordion.Item eventKey="0" className="pet-servico-card-item">
              <Accordion.Header>
                  <Stack direction="horizontal" gap={3}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                      <FormCheck type="switch" id="buscarChk" onChange={ e => {
                        setIncluirBuscar(e.target.checked);
                      }}></FormCheck>
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
                  prefix={'enderecoBuscar'}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" className="pet-servico-card-item">
              <Accordion.Header>
                  <Stack direction="horizontal" gap={3}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <FormCheck type="switch" id="devolverChk" onChange={ e => {
                        setIncluirDevolver(e.target.checked);
                      }}></FormCheck>
                    </Form.Group>  
                    <span>Devolver</span>

                  </Stack>
              </Accordion.Header>
              <Accordion.Body>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <FormCheck type="switch" id="devolverMesmo" label="O mesmo do anterior" 
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
                  prefix={'enderecoDevolver'}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Row>
            <FloatingLabel className="mt-4" controlId="floatingTextarea2" label="Observações">
              <Form.Control
                as="textarea"
                placeholder="Deixe aqui uma observação"
                style={{ height: '150px' }}
                {...register("observacoes")}
              />
            </FloatingLabel>
          </Row>
          <Button 
          variant="primary" 
          onClick={e => {getData()}} 
          type="submit" 
          className="mt-4">
            Agendar
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Agendamento;