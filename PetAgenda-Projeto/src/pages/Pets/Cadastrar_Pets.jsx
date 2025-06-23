import { useEffect, useState } from "react";
import styles from "./Cadastrar_Pets.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/UserContext";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import styled from "styled-components";
import { Checkbox } from "antd";
import { DatePicker } from "antd";
import { Controller } from "react-hook-form";

const CadastrarPets = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [clienteEscolhido, setClienteEscolhido] = useState({});
  const [especies, setEspecies] = useState();
  const [pet, setPet] = useState();
  const { empresaFetch } = useAuth();
  const [aceito, setAceito] = useState(false);
  const BigCheckbox = styled(Checkbox)`
    .ant-checkbox-inner {
      width: 20px !important;
      height: 20px !important;
    }
    .ant-checkbox-inner::after {
      top: 8px !important;
      left: 6px !important;
      width: 6px !important;
      height: 12px !important;
    }
    &.ant-checkbox-wrapper {
      transform: scale(1.3);
      margin-left: 20px;
      margin-bottom: 10px;
    }
    span {
      font-size: 14px;
    }
  `;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // const cadastrarPet = async (pet) => {
  //   const jsonPet = JSON.stringify(pet);
  //   console.log("novo: ",jsonPet);
  //   try {
  //     const res = await empresaFetch('/pet', {
  //         method: "POST",
  //         body: JSON.stringify(pet)
  //     });

  //     const jsonBody = await res.json();

  //     if (res.status == 200) {
  //       const idPet = jsonBody.pet.id;

  //       alert('cadastrado');
  //       navigate(`/empresa/pets/lista`);
  //     } else {
  //         alert('erro ao cadastrar pet');
  //     }
  //   } catch (err) {
  //     alert('Falha ao cadastrar pet: ' + err.message);
  //   }
  // };

  const onSubmit = (data) => {
    const newPet = {
      dono: {
        id: data.clienteId,
      },
      especie: {
        id: data.especie,
      },
      nome: data.nome,
      sexo: data.sexo,
      porte: data.porte,
      eCastrado: data.eCastrado,
      estadoSaude: data.estadoSaude,
      raca: data.raca,
      cor: data.cor,
      comportamento: data.comportamento,
      cartaoVacina: null,
    };
    console.log("novo: ", newPet);

    // cadastrarPet(newPet);
  };

  const onErrors = (errors) => {
    console.log(errors);
  };

  // async function obterClientes() {
  //   try {
  //     const cliResp = await empresaFetch('/cliente');

  //     if (cliResp.status == 200) {
  //       const jsonBody = await cliResp.json();

  //       if (!jsonBody) {
  //         throw new Error("servidor enviou corpo vazio");
  //       }

  //       if (!jsonBody.clientes) {
  //         throw new Error(jsonBody.message);
  //       }

  //       if (jsonBody.clientes.length == 0) {
  //         return [];
  //       } else {
  //         return jsonBody.clientes;
  //       }
  //     } else {
  //       throw new Error('requisição não retornou código 200');
  //     }
  //   } catch (err) {
  //     err.message = "Falha ao obter clientes cadastrados: " + err.message;
  //     throw err;
  //     // return [];
  //   }
  // }

  // async function obterEspecies() {
  //   try {
  //     const espResp = await empresaFetch('/pet/especie');

  //     if (espResp.status == 200) {
  //       const jsonBody = await espResp.json();
  //       if (!jsonBody) {
  //         throw new Error("servidor enviou corpo vazio");
  //       }

  //       if (!jsonBody.especiesPet) {
  //         throw new Error(jsonBody.message);
  //       }

  //       return jsonBody.especiesPet;

  //     } else {
  //       throw new Error('requisição não retornou código 200');
  //     }
  //   } catch (err) {
  //     err.message = "Falha ao obter espécies cadastradas: " + err.message;
  //     throw err;
  //     // return [];
  //   }
  // }

  // useEffect(() => {
  //   // Populando clientes
  //   obterClientes()
  //     .then( cliList => {
  //       setClientes(cliList);
  //       console.log('clientes encontrados: ', cliList);
  //     })
  //     .catch( err => {
  //       alert(err.message);
  //     });

  //   // Populando espécies
  //   obterEspecies()
  //     .then( espList => {
  //       setEspecies(espList);
  //     })
  //     .catch( err => {
  //       alert(err.message);
  //     });
  // }, []);

  return (
    <div className={`mt-1 ${styles.containergeral}`}>
      <h1 className={styles.cadastrar_agendamento__title}>Cadastrar Pet</h1>
      <hr />
      <Container className={`mt-4 ${styles.cadatrar_agendamento}`}>
        <Form
          action=""
          onSubmit={handleSubmit(onSubmit, onErrors)}
          className={styles.previnindoVazamento}
        >
          <Row>
            <Col className={styles.campos_espaco}>
              <Form.Group>
                <Form.Label>Dono:</Form.Label>
                <Form.Select
                  {...register("clienteId", {
                    required: {
                      value: true,
                      message: "Selecione o dono do pet",
                    },
                  })}
                >
                  <option value="">Selecione um dono</option>
                  {clientes.map((cliente) => (
                    <option value={cliente.id} key={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </Form.Select>
                {errors.clienteId && (
                  <p style={{ color: "red" }}>{errors.clienteId.message}</p>
                )}
              </Form.Group>
            </Col>
            <Col className={styles.campos_espaco}>
              <Form.Group>
                <Form.Label>Nome do Pet:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome do pet"
                  {...register("nome", {
                    required: {
                      value: true,
                      message: "Nome do pet é obrigatório",
                    },
                    maxLength: {
                      value: 64,
                      message: "Nome deve ser de até 64 caracteres",
                    },
                  })}
                />
                {errors.nome && (
                  <p style={{ color: "red" }}>{errors.nome.message}</p>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Especie:</Form.Label>
                <Form.Select
                  id="especie-select"
                  {...register("especie", {
                    required: {
                      value: true,
                      message: "Espécie do Pet precisa ser definida",
                    },
                  })}
                >
                  <option value="">Selecione</option>
                  {especies &&
                    especies.map((esp) => {
                      return (
                        <option value={esp.id} key={esp.id}>
                          {esp.nome}
                        </option>
                      );
                    })}
                </Form.Select>
                {errors.especie && (
                  <p style={{ color: "red" }}>{errors.especie.message}</p>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className={styles.campos_espaco}>
              <Form.Group className={styles.raca_input}>
                <Form.Label>Raça:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite a raça"
                  {...register("raca", {
                    required: false,
                    maxLength: {
                      value: 64,
                      message: "Tamanho máximo é de 64 caracteres.",
                    },
                  })}
                />
              </Form.Group>
            </Col>
            <Col className={styles.campos_espaco}>
              <Form.Group>
                <Form.Label>Cor:</Form.Label>
                <Form.Control
                  type="text"
                  name=""
                  id=""
                  placeholder="Escreva a cor"
                  {...register("cor", {
                    required: false,
                    maxLength: {
                      value: 16,
                      message: "Cor deve ser entre 0 e 16 caracteres.",
                    },
                  })}
                />
                {errors.cor && (
                  <p style={{ color: "red" }}>{errors.cor.message}</p>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Porte:</Form.Label>
                <Form.Select
                  name="porte"
                  id=""
                  {...register("porte", {
                    required: {
                      value: true,
                      message: "Informe o porte do pet",
                    },
                  })}
                >
                  <option value="">Selecione</option>
                  <option value="G">Grande</option>
                  <option value="M">Médio</option>
                  <option value="P">Pequeno</option>
                </Form.Select>
                {errors.porte && (
                  <p style={{ color: "red" }}>{errors.porte.message}</p>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={3} className={styles.campos_espaco}>
              <Form.Group>
                <Form.Label>Sexo:</Form.Label>
                <Form.Select
                  {...register("sexo", {
                    required: {
                      value: true,
                      message: "O sexo do Pet precisa ser definido",
                    },
                  })}
                >
                  <option value="">Selecione</option>
                  <option value="M">Macho</option>
                  <option value="F">Fêmea</option>
                </Form.Select>
                {errors.sexo && (
                  <p style={{ color: "red" }}>{errors.sexo.message}</p>
                )}
              </Form.Group>
            </Col>
            <Col className={`d-flex align-items-end ${styles.campos_espaco}`}>
              <div>
                <Form.Group className="d-flex align-items-center gap-2 mb-0">
                  <BigCheckbox
                    onChange={(e) => setAceito(e.target.checked)}
                    {...register("eCastrado", { required: false })}
                  >
                    Castrado?
                  </BigCheckbox>
                </Form.Group>
              </div>
            </Col>
          </Row>
          <Row className="mt-4 ${styles.cartaoVacina}">
            <Col>
              <h2>Saúde</h2>
              <hr />
            </Col>

            <Col className="mt-3" xs={12}>
              <Form.Group>
                <Form.Label>Estado de saúde</Form.Label>
                <Form.Control
                  as="textarea"
                  className={styles.inputTextArea}
                  placeholder="Descreva o estado de saúde do pet"
                  {...register("estadoSaude", {
                    required: {
                      value: true,
                      message: "Informe o estado de saúde atual do pet",
                    },
                    maxLength: {
                      value: 32,
                      message: "O máximo de caracteres é 32.",
                    },
                  })}
                />
                {errors.estadoSaude && (
                  <p style={{ color: "red" }}>{errors.estadoSaude.message}</p>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Cartão de Vacina</Form.Label>
                <Form.Control type="file" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <Form.Group>
                <Form.Label>Comportamento</Form.Label>
                <Form.Control
                  as="textarea"
                  className={styles.inputTextArea}
                  placeholder="Descreva o comportamento do pet"
                  {...register("comportamento", {
                    maxLength: {
                      value: 64,
                      message: "O máximo de caracteres é 64.",
                    },
                  })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center">
            <Col md="auto">
              <Button type="submit" className="mt-4 mb-4 button-agendamento">
                Cadastrar
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default CadastrarPets;
