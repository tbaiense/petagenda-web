import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Col, Form, InputGroup, Row, Container } from "react-bootstrap";
import "./Cadastrar_Servico.css";
import { useAuth } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "antd";

function CadastrarServico() {
  const [mensagemAlerta, setMensagemAlerta] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const [especies, setEspecies] = useState([]);
  const { getToken, getEmpresa, validar, empresaFetch } = useAuth();

  useEffect(() => {
    async function getServicosOferecidos() {
      let errMsg;
      try {
        const fetchOpts = { method: "GET" };

        const response = await empresaFetch(
          "/servico-oferecido/categoria",
          fetchOpts
        );

        const jsonBody = await response.json();

        if (response.status == 200) {
          if (jsonBody.categoriasServicoOferecido?.length > 0) {
            setCategorias(jsonBody.categoriasServicoOferecido);
          }
          return;
        } else {
          if (jsonBody?.errors) {
            errMsg = jsonBody.errors.join("\n");
          } else {
            errMsg = "Erro ao obter categorias";
          }
          throw new Error(errMsg);
        }
      } catch (err) {
        alert("Falha ao obter serviços oferecidos:\n" + err.message);
      }
    }

    async function getEspeciesPet() {
      let errMsg;
      try {
        const fetchOpts = { method: "GET" };

        const response = await empresaFetch("/pet/especie", fetchOpts);

        const jsonBody = await response.json();

        if (response.status == 200) {
          if (jsonBody.especiesPet?.length > 0) {
            setEspecies(jsonBody.especiesPet);
          }
          return;
        } else {
          if (jsonBody?.errors) {
            errMsg = jsonBody.errors.join("\n");
          } else {
            errMsg = "Erro desconhecido";
          }
          throw new Error(errMsg);
        }
      } catch (err) {
        alert("Falha ao obter espécies de pet:\n" + err.message);
      }
    }

    if (validar) {
      getServicosOferecidos();
      getEspeciesPet();
    }
  }, []);

  const { register, handleSubmit, reset, watch, getValues, setValue } =
    useForm();

  const imagemServ = watch("pathImgFile");
  const imagemServURL =
    imagemServ && imagemServ[0] ? URL.createObjectURL(imagemServ[0]) : null;

  const onSubmit = (data) => {
    const objServ = {
      nome: data.nome.trim(),
      categoria: +data.categoria,
      tipoPreco: data.tipoPreco,
      preco: +data.preco.replace(",", "."),
      descricao: data.descricao.trim(),
      restricaoParticipante: data.restricaoParticipante,
      restricaoEspecie:
        data.restricaoEspecie?.length > 0
          ? data.restricaoEspecie.map((rest) => ({ especie: +rest }))
          : undefined,
    };

    empresaFetch("/servico-oferecido", {
      method: "POST",
      body: JSON.stringify(objServ),
    }).then(async (res) => {
      if (res.status == 200) {
        const json = await res.json();
        const idServ = json.servicoOferecido?.id;
        if (idServ) {
          setMensagemAlerta({
            tipo: "success",
            titulo: "Serviço cadastrado com sucesso!",
            descricao: "O serviço foi adicionado à lista.",
          });
          setTimeout(() => {
            setMensagemAlerta(null);
          }, 2500);
          await new Promise((resolve) => setTimeout(resolve, 2500));
          navigate(`/empresa/servicos/lista`);
        }
      } else {
        setMensagemAlerta({
          tipo: "error",
          titulo: "Erro ao cadastrar serviço",
          descricao: errorText,
        });
        setTimeout(() => {
          setMensagemAlerta(null);
        }, 3000);
      }
    });

    reset();
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
      <h1 className="cadastrar_agendamento__title">Novo Serviço</h1>
      <hr />
      <Container className="cadatrar_agendamento mt-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col className="campos-espaco">
              <Form.Group controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome do serviço"
                  {...register("nome")}
                />
              </Form.Group>
            </Col>
            <Col className="campos-espaco">
              <Form.Group controlId="formCategoria">
                <Form.Label>Categoria</Form.Label>
                <Form.Select {...register("categoria")}>
                  <option value="">Selecione...</option>
                  {categorias?.length > 0 &&
                    categorias.map((cat) => {
                      return (
                        <option key={cat.id} value={cat.id}>
                          {cat.nome}
                        </option>
                      );
                    })}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col className="campos-espaco">
              <Form.Group controlId="formValor">
                <Form.Label>Valor</Form.Label>
                <InputGroup>
                  <InputGroup.Text>R$</InputGroup.Text>
                  <Form.Control
                    type="text"
                    className="form-agendamento"
                    placeholder="Valor do serviço"
                    {...register("preco", {
                      onChange: (e) => {
                        let preco = getValues("preco");
                        preco = preco.replaceAll(/[^\d,.]/g, "");
                        preco = preco.replace(".", ",");

                        setValue("preco", preco);
                      },
                    })}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="campos-espaco">
              <Form.Group controlId="formTipo">
                <Form.Label>Tipo de cobrança</Form.Label>
                <Form.Select {...register("tipoPreco")}>
                  <option value="">Selecione...</option>
                  <option value="pet">Por cada pet</option>
                  <option value="servico">Por serviço</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col className="campos-espaco">
              <Form.Group className="" controlId="formRestricaoParticipantes">
                <Form.Label>Restrição de participantes</Form.Label>
                <Form.Select {...register("restricaoParticipante")}>
                  <option value="">Selecione...</option>
                  <option value="individual">Individual</option>
                  <option value="coletivo">Coletivo</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3 mb-3">
            <Col className="campos-espaco">
              <Form.Group controlId="formRestricaoEspecies">
                <Form.Label>Restrição de espécies</Form.Label>
                <div className="check_box_especies">
                  {especies?.length > 0 &&
                    especies.map((especie) => (
                      <Form.Check
                        key={especie.id}
                        type="checkbox"
                        label={especie.nome}
                        value={especie.id}
                        name="especie"
                        {...register("restricaoEspecie[]")}
                      />
                    ))}
                </div>
              </Form.Group>
            </Col>
            <Col className="campos-espaco">
              <Form.Group controlId="formDescricaoRestricao">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Descreva detalhes sobre o serviço"
                  {...register("descricao")}
                />
              </Form.Group>
            </Col>
          </Row>
          <div>
            <h4>Foto de Perfil</h4>
            {imagemServURL && (
              <img
                src={imagemServURL}
                alt="Pre-Visualização"
                width={200}
                height={210}
              />
            )}
            <input type="file" {...register("pathImgFile")} />
          </div>

          {/* Botão de Cadastro */}

          <div className="cadastrarServico__btnWrapper">
            <Button
              type="submit"
              variant="primary"
              className="botao__cadastrar"
            >
              Cadastrar
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}
export default CadastrarServico;
