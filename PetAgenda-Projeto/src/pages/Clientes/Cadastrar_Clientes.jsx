import styles from "./Cadastrar_Clientes.module.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { clientes } from "../../data/testeDeTabela";
import { useAuth } from "../../contexts/UserContext";
import CamposEndereco from "../../components/Endereco/CamposEndereco";
import { useNavigate } from "react-router-dom";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { Alert } from "antd";

const CadastrarClientes = () => {
  const [mensagemAlerta, setMensagemAlerta] = useState(null);
  const { empresaFetch, validar } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [endereco, setEndereco] = useState({});
  const [cep, setCep] = useState("");

  const navigate = useNavigate();
  const [servicosSelecionados, setServicosSelecionados] = useState([]);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
    subscribe,
    reset,
    watch,
  } = useForm();

  async function preencherEnderecosCEP(cep) {
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
        console.log("fetch cep");

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
            setValue(`endereco.${key}`, value, { shouldTouch: true });
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

  // Verificação de CEP
  useEffect(() => {
    if (cep?.length == 8 && cep.match(/^\d{5,5}\d{3,3}$/)) {
      preencherEnderecosCEP(cep);
    }
  }, [cep]);

  function handleEnderecoChange(e) {
    const newEnd = { ...endereco };
    newEnd[e.target.name.split(".")[1]] = e.target.value;

    setEndereco(newEnd);
    setValue(e.target.name.split(".")[1], e.target.value);
  }

  // Pego os serviços oferecidos do banco da empresa
  useEffect(() => {
    if (validar) {
      empresaFetch("/servico-oferecido")
        .then((res) => res.json())
        .then((data) => {
          setServicos(data.servicosOferecidos);
        })
        .catch((error) => {
          console.error("Erro ao buscar serviçoes oferecidos:", error);
        });
    }
  }, []);

  // Aqui esta pegando o serviço pelo id
  const handleSelectChange = (e) => {
    if (servicos?.length > 0) {
      const selectedId = e.target.value;
      const servico = servicos.find((s) => s.id.toString() === selectedId);

      if (!servicosSelecionados.some((s) => s.id === servico.id)) {
        setServicosSelecionados((prev) => [...prev, servico]);
      }
    }
  };

  async function cadastrarCliente(objCli) {
    return empresaFetch("/cliente", {
      method: "POST",
      body: JSON.stringify(objCli),
    }).then(async (res) => {
      if (res.status == 200) {
        const json = await res.json();

        return json;
      } else {
        setMensagemAlerta({
          tipo: "error",
          titulo: "Erro ao cadastrar cliente",
          descricao: errorText || "Ocorreu um erro ao cadastrar o cliente.",
        });
        setTimeout(() => {
          setMensagemAlerta(null);
        }, 3000);
      }
    });
  }

  const onSubmit = async (data) => {
    console.log("submit: ", data);
    const objCli = {
      ...data,
      servico: undefined,
      servicoRequerido: servicosSelecionados.map((s) => ({ servico: s.id })),
    };

    if (validar) {
      const jsonResp = await cadastrarCliente(objCli);
      if (jsonResp.success) {
        setMensagemAlerta({
          tipo: "success",
          titulo: "Cliente cadastrado com sucesso!",
          descricao: "O cliente foi adicionado à lista.",
        });
        setTimeout(() => {
          setMensagemAlerta(null);
        }, 2500);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        reset();
        setServicosSelecionados([]);

        navigate(`/empresa/clientes/lista`);
      }
    }
  };

  const onError = (errors) => {
    console.log("error ao enviar: ", errors);
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
      <h1 className="cadastrar_agendamento__title">Novo Cliente</h1>
      <hr />
      <Container className="cadatrar_agendamento mt-4">
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <Row>
            <Col className="campos-espaco">
              <Form.Group controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome"
                  isInvalid={!!errors.nome}
                  {...register("nome", {
                    required: "O nome é obrigatório",
                    minLength: {
                      value: 10,
                      message: "O nome deve ter pelo menos 10 caracteres",
                    },
                    maxLength: {
                      value: 100,
                      message: "O nome deve ter no máximo 100 caracteres",
                    },
                    onChange: (e) => {
                      let value = e.target.value;
                      value = value
                        .split(" ")
                        .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
                        .join(" ");
                      setValue("nome", value);
                    },
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nome?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="formTelefone">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="27 99988-7766"
                  isInvalid={!!errors.telefone}
                  {...register("telefone", {
                    required: "O telefone é obrigatório",
                    pattern: {
                      value: /^\d{2} \d{5}-\d{4}$/,
                      message: "Formato esperado: 27 99888-7766",
                    },
                    onChange: (e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      value = `${value.slice(0, 2)}${
                        value.length > 2 ? " " : ""
                      }${value.slice(2, 7)}${
                        value.length > 7 ? "-" : ""
                      }${value.slice(7, 11)}`;
                      setValue("telefone", value);
                    },
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.telefone?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <h3>Endereço</h3>
              <hr />
              <CamposEndereco
                setValue={setValue}
                cep={cep}
                setCep={setCep}
                endereco={endereco}
                handleChange={handleEnderecoChange}
                register={register}
                errors={errors}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>Serviços Requeridos</h3>
              <hr />
              <Form.Group controlId="formServico">
                <Form.Label>Serviço</Form.Label>
                <Form.Select
                  {...register("servico")}
                  onChange={handleSelectChange}
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map((servico) => (
                    <option key={servico.id} value={servico.id}>
                      {servico.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="mt-3">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Categoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicosSelecionados.map((servico) => (
                      <tr key={servico.id}>
                        <td>{servico.nome}</td>
                        <td>{servico.nomeCategoria}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center mt-4">
            <Col md="auto">
              <Button
                variant="primary"
                type="submit"
                className="botao__cadastrar"
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

export default CadastrarClientes;
