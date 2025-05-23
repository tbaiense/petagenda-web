import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./PlanosEmpresa.css";
import MenuDashBoard from "../../components/SideBar/SideBar";
import { useState } from "react";

function PlanosEmpresa() {
  const [selected, setSelected] = useState("Mensal");
  const [precoBasico, setPrecoBasico] = useState("R$ 29,90");
  const [precoProfissional, setPrecoProfissional] = useState("R$ 29,90");
  const [precoCorporativo, setPrecoCorporativo] = useState("R$ 29,90");

  const handleChange = (plano) => {
    setSelected(plano);

    switch (plano) {
      case "Mensal":
        setPrecoBasico("29,90");
        setPrecoProfissional("60,90");
        setPrecoCorporativo("100,90");
        break;
      case "Trimestral":
        setPrecoBasico("79,90");
        setPrecoProfissional("159,90");
        setPrecoCorporativo("249,90");
        break;
      case "Anual":
        setPrecoBasico("299,90");
        setPrecoProfissional("599,90");
        setPrecoCorporativo("999,90");
        break;
      default:
        setPrecoBasico("");
        setPrecoProfissional("");
        setPrecoCorporativo("");
    }
  };

  const Assinar = (plano) => {
    const dadoPlano = {
      tipo: plano,
      periodo: selected
    }

    console.log(dadoPlano)
  };

  return (
    <div>
      <section className="plano__section">
        <Container className="">
          <Row className="justify-content-center">
            <Col className="text-center">
              <div className="radio-inputs">
                <label className="radio">
                  <input
                    type="radio"
                    name="radio"
                    value="Mensal"
                    checked={selected === "Mensal"}
                    onChange={() => handleChange("Mensal")}
                  />
                  <span className="name">Mensal</span>
                </label>

                <label className="radio">
                  <input
                    type="radio"
                    name="radio"
                    value="Trimestral"
                    checked={selected === "Trimestral"}
                    onChange={() => handleChange("Trimestral")}
                  />
                  <span className="name">Trimestral</span>
                </label>

                <label className="radio">
                  <input
                    type="radio"
                    name="radio"
                    value="Anual"
                    checked={selected === "Anual"}
                    onChange={() => handleChange("Anual")}
                  />
                  <span className="name">Anual</span>
                </label>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center plano__linha gap-5">
            <Col md={3} className="plano__coluna text-center">
              <div className="plano__item">
                <img
                  src="https://placehold.co/250"
                  alt="Plano Básico"
                  className="plano__imagem"
                />
                <h4 className="plano__titulo">Básico</h4>
                <h5 className="plano__preco">
                  <span className="plano__preco_unidade">R$</span> {precoBasico}
                </h5>
                <ul className="plano__lista">
                  <li className="plano__item__caracteristica">
                    XX Agendamentos
                  </li>
                  <li className="plano__item__caracteristica">
                    XX Relatórios Simples
                  </li>
                  <li className="plano__item__caracteristica">
                    XX Relatórios Detalhados
                  </li>
                  <li className="plano__item__caracteristica">
                    XX Relatórios Simples Financeiro
                  </li>
                  <li className="plano__item__caracteristica">
                    XX Pacotes de Agendamentos
                  </li>
                </ul>
                <Button
                  variant="primary"
                  onClick={() => Assinar("Basico")}
                  className="plano__botao"
                >
                  Assinar
                </Button>
              </div>
            </Col>
            <Col md={3} className="plano__coluna text-center">
              <div className="plano__item">
                <img
                  src="https://placehold.co/250"
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
                    XX Agendamentos
                  </li>
                  <li className="plano__item__caracteristica">
                    XX Relatórios Simples
                  </li>
                  <li className="plano__item__caracteristica">
                    XX Relatórios Detalhados
                  </li>
                  <li className="plano__item__caracteristica">
                    XX Relatórios Simples Financeiro
                  </li>
                  <li className="plano__item__caracteristica">
                    XX Pacotes de Agendamentos
                  </li>
                </ul>
                <Button
                  variant="primary"
                  onClick={() => Assinar("Profissional")}
                  className="plano__botao"
                >
                  Assinar
                </Button>
              </div>
            </Col>
            <Col md={3} className="plano__coluna text-center">
              <div className="plano__item">
                <img
                  src="https://placehold.co/250"
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
                    XX Agendamentos
                  </li>
                  <li className="plano__item__caracteristica">
                    XX Relatórios Simples
                  </li>
                  <li className="plano__item__caracteristica">
                    XX Relatórios Detalhados
                  </li>
                  <li className="plano__item__caracteristica">
                    XX Relatórios Simples Financeiro
                  </li>
                  <li className="plano__item__caracteristica">
                    XX Pacotes de Agendamentos
                  </li>
                </ul>
                <Button variant="primary" onClick={() => Assinar("Corporativo")} className="plano__botao">
                  Assinar
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
