import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./PlanosEmpresa.css";
import MenuDashBoard from "../../../components/SideBar/SideBar";
import { useState } from "react";
import NavEmpresa from "../../../components/navegacaoEmpresa/NavEmpresa.jsx";
import { useAuth } from "../../../contexts/UserContext";
import { useEffect } from 'react';


function PlanosEmpresa() {
  const { 
    getToken, getEmpresa, 
    getLicenca, setLicenca, removeLicenca, 
    empresaFetch 
  } = useAuth();

  useEffect(() => {
    const licenca = getLicenca();

    console.log((licenca) ? ` licença atual: ${licenca}` : 'empresa sem licença!');
  }, []);

  const [selected, setSelected] = useState("mensal");
  const [precoBasico, setPrecoBasico] = useState("R$ 29,90");
  const [precoProfissional, setPrecoProfissional] = useState("R$ 29,90");
  const [precoCorporativo, setPrecoCorporativo] = useState("R$ 29,90");

  const handleChange = (plano) => {
    setSelected(plano);

    switch (plano) {
      case "mensal":
        setPrecoBasico("29,90");
        setPrecoProfissional("60,90");
        setPrecoCorporativo("100,90");
        break;
      case "trimestral":
        setPrecoBasico("79,90");
        setPrecoProfissional("159,90");
        setPrecoCorporativo("249,90");
        break;
      case "anual":
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

  const assinarPlano = async (plano) => {
    const dadoPlano = {
      tipo: plano,
      periodo: selected
    }

    try {
      const fetchOpts = {
        method: "POST",
        body: JSON.stringify(dadoPlano)
      }
      const response = await empresaFetch(
        '/licenca',
        fetchOpts
      );
  
      const jsonBody = await response.json();
      if (response.status == 200 && jsonBody?.success) {
        setLicenca(dadoPlano.tipo);
        alert(jsonBody.message);
        return;
      } else {
        throw new Error(jsonBody.errors.join('\n'));
      }
    } catch (err) {
      alert("Falha ao obter licença:\n" + err.message);
    }
  };

  return (
    <div>
      <NavEmpresa/>
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
            <h1>Atual: {(getLicenca()) ? getLicenca() : "não possui"}</h1>
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
                    75 Agendamentos
                  </li>
                  <li className="plano__item__caracteristica">
                    2 Relatórios Simples
                  </li>
                </ul>
                <Button
                  variant="primary"
                  onClick={() => assinarPlano("basico")}
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
                  onClick={() => assinarPlano("profissional")}
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
                    Agendamentos <strong>ilimitados</strong>
                  </li>
                  <li className="plano__item__caracteristica">
                    Relatórios Simples <strong>ilimitados</strong>
                  </li>
                  <li className="plano__item__caracteristica">
                    Relatórios Detalhados <strong>ilimitados</strong>
                  </li>
                </ul>
                <Button variant="primary" onClick={() => assinarPlano("corporativo")} className="plano__botao">
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
