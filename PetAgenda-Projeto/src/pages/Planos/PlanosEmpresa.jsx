import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./PlanosEmpresa.css";
import MenuDashBoard from "../../components/SideBar/MenuDashboard";

function PlanosEmpresa() {
  return (
    <div>
      {/* <MenuDashBoard /> */}

      <section className="plano__section">
        <Container className="plano__container">
          <Row className="justify-content-center plano__linha gap-4">
            <Col md={3} className="plano__coluna text-center">
              <div className="plano__item">
                <img
                  src="https://placehold.co/250"
                  alt="Plano Básico"
                  className="plano__imagem"
                />
                <h4 className="plano__titulo">Básico</h4>
                <h5 className="plano__preco">
                  <span className="plano__preco_unidade">R$</span> XXX,00
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
                <Button variant="primary" className="plano__botao">
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
                  <span className="plano__preco_unidade">R$</span> XXX,00
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
                <Button variant="primary" className="plano__botao">
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
                  <span className="plano__preco_unidade">R$</span> XXX,00
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
                <Button variant="primary" className="plano__botao">
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
