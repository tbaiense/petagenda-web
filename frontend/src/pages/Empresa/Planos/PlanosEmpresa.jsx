import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./PlanosEmpresa.css";
import MenuDashBoard from "../../../components/SideBar/SideBar";
import { useState } from "react";
import NavEmpresa from "../../../components/navegacaoEmpresa/NavEmpresa.jsx";
import { useAuth } from "../../../contexts/UserContext";
import { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import image1 from "../../../assets/ImagensProjeto/pet5.jpg";
import image2 from "../../../assets/ImagensProjeto/pet6.jpg";
import image3 from "../../../assets/ImagensProjeto/pet7.jpg";
function PlanosEmpresa() {
  const [mensagemAlerta, setMensagemAlerta] = useState(null);
  const {
    getToken,
    getEmpresa,
    getLicenca,
    setLicenca,
    removeLicenca,
    empresaFetch,
  } = useAuth();

  useEffect(() => {
    const licenca = getLicenca();

    console.log(
      licenca ? ` licença atual: ${licenca}` : "empresa sem licença!"
    );
  }, []);

  const [selected, setSelected] = useState("mensal");
  const [precoBasico, setPrecoBasico] = useState("89,99");
  const [precoProfissional, setPrecoProfissional] = useState("264,99");
  const [precoCorporativo, setPrecoCorporativo] = useState("379,99");
  const [isLoading, setIsLoading] = useState(false);
  const [planoSel, setPlanoSel] = useState("");

  const handleChange = (plano) => {
    setSelected(plano);

    switch (plano) {
      case "mensal":
        setPrecoBasico("89,99");
        setPrecoProfissional(" 264,99");
        setPrecoCorporativo("379,99");
        break;
      case "trimestral":
        setPrecoBasico("249,99");
        setPrecoProfissional("739,99");
        setPrecoCorporativo("1.059,99");
        break;
      case "anual":
        setPrecoBasico("864,99");
        setPrecoProfissional("2.544,99");
        setPrecoCorporativo("3.644,99");
        break;
      default:
        setPrecoBasico("");
        setPrecoProfissional("");
        setPrecoCorporativo("");
    }
  };

  useEffect(() => {
    if (planoSel) {
      setIsLoading(true);
      assinarPlano(planoSel);
    }
  }, [planoSel]);

  const assinarPlano = async (plano) => {
    const dadoPlano = {
      tipo: plano,
      periodo: selected,
    };

    try {
      const fetchOpts = {
        method: "POST",
        body: JSON.stringify(dadoPlano),
      };
      const response = await empresaFetch("/licenca", fetchOpts);

      const jsonBody = await response.json();
      setIsLoading(false);
      if (response.status == 200 && jsonBody?.success) {
        setLicenca(dadoPlano.tipo);
        setMensagemAlerta({
          tipo: "success",
          titulo: "Assinatura realizada com sucesso!",
          descricao: `Você assinou o plano ${dadoPlano.tipo} por ${dadoPlano.periodo}.`,
        });
        setTimeout(() => {
          setMensagemAlerta(null);
        }, 2500);
        return;
      } else {
        throw new Error(jsonBody.errors.join("\n"));
      }
    } catch (err) {
      setIsLoading(false);
      setMensagemAlerta({
        tipo: "error",
        titulo: "Erro ao assinar plano",
        descricao: `Ocorreu um erro ao tentar assinar o plano ${plano}.`,
      });
      setTimeout(() => {
        setMensagemAlerta(null);
      }, 3000);
    }
  };

  return (
    <div>
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
      <NavEmpresa />
      <section className="plano__section">
        <Container className="">
          <Row className="justify-content-center">
            <Col className="text-center">
              <div className="radio-inputs">
                <label className="radio">
                  <input
                    type="radio"
                    name="radio"
                    value="mensal"
                    checked={selected === "mensal"}
                    onChange={() => handleChange("mensal")}
                  />
                  <span className="name">Mensal</span>
                </label>

                <label className="radio">
                  <input
                    type="radio"
                    name="radio"
                    value="trimestral"
                    checked={selected === "trimestral"}
                    onChange={() => handleChange("trimestral")}
                  />
                  <span className="name">Trimestral</span>
                </label>

                <label className="radio">
                  <input
                    type="radio"
                    name="radio"
                    value="anual"
                    checked={selected === "anual"}
                    onChange={() => handleChange("anual")}
                  />
                  <span className="name">Anual</span>
                </label>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center plano__linha gap-5">
            <div className="plano_atual">
              <h7 className="plano_atualizacao">
                Atual: {getLicenca() ? getLicenca() : "não possui"}
              </h7>
            </div>
            <Col md={3} className="plano__coluna text-center">
              <div className="plano__item">
                <img
                  src={image3}
                  alt="Plano Básico"
                  className="plano__imagem"
                />
                <h4 className="plano__titulo">Básico</h4>
                <h5 className="plano__preco">
                  <span className="plano__preco_unidade">R$</span> {precoBasico}
                </h5>
                <ul className="plano__lista">
                  <li className="plano__item__caracteristica">
                    75 Agendamentos
                  </li>
                  <li className="plano__item__caracteristica">
                    2 Relatórios Simples
                  </li>
                </ul>
                <Button
                  variant="primary"
                  onClick={() => setPlanoSel("basico")}
                  className="plano__botao"
                  disabled={!!isLoading}
                >
                  Assinar
                  {isLoading && planoSel == "basico" && (
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "0.8em",
                        verticalAlign: "center",
                      }}
                    >
                      <LoadingOutlined />
                    </span>
                  )}
                </Button>
              </div>
            </Col>
            <Col md={3} className="plano__coluna text-center">
              <div className="plano__item">
                <img
                  src={image2}
                  alt="Plano Básico"
                  className="plano__imagem"
                />
                <h4 className="plano__titulo">Profissional</h4>
                <h5 className="plano__preco">
                  <span className="plano__preco_unidade">R$</span>{" "}
                  {precoProfissional}
                </h5>
                <ul className="plano__lista">
                  <li className="plano__item__caracteristica">
                    Agendamentos <strong>ilimitados</strong>
                  </li>
                  <li className="plano__item__caracteristica">
                    12 Relatórios Simples
                  </li>
                  <li className="plano__item__caracteristica">
                    8 Relatórios Detalhados
                  </li>
                </ul>
                <Button
                  variant="primary"
                  onClick={() => setPlanoSel("profissional")}
                  className="plano__botao"
                  disabled={!!isLoading}
                >
                  Assinar
                  {isLoading && planoSel == "profissional" && (
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "0.8em",
                        verticalAlign: "center",
                      }}
                    >
                      <LoadingOutlined />
                    </span>
                  )}
                </Button>
              </div>
            </Col>
            <Col md={3} className="plano__coluna text-center">
              <div className="plano__item">
                <img
                  src={image1}
                  alt="Plano Básico"
                  className="plano__imagem"
                />
                <h4 className="plano__titulo">Corporativo</h4>
                <h5 className="plano__preco">
                  <span className="plano__preco_unidade">R$</span>{" "}
                  {precoCorporativo}
                </h5>
                <ul className="plano__lista">
                  <li className="plano__item__caracteristica">
                    Agendamentos <strong>ilimitados</strong>
                  </li>
                  <li className="plano__item__caracteristica">
                    Relatórios Simples <strong>ilimitados</strong>
                  </li>
                  <li className="plano__item__caracteristica">
                    Relatórios Detalhados <strong>ilimitados</strong>
                  </li>
                </ul>
                <Button
                  variant="primary"
                  onClick={() => setPlanoSel("corporativo")}
                  className="plano__botao"
                  disabled={!!isLoading}
                >
                  Assinar
                  {isLoading && planoSel == "corporativo" && (
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "0.8em",
                        verticalAlign: "center",
                      }}
                    >
                      <LoadingOutlined />
                    </span>
                  )}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default PlanosEmpresa;
