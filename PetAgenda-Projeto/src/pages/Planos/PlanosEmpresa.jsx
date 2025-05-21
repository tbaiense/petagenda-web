import React from "react"; 
import { Container, Row, Col, Button } from "react-bootstrap"; 
import "./PlanosEmpresa.css"; 

function PlanosEmpresa() { 
  return ( 
    <div> 
      {/* <MenuDashBoard /> */}

      <section className="plano__section"> 
        <Container fluid="md" className="plano__container"> 
          <Row className="justify-content-center gap-4 plano__linha"> 
            <Col className="text-center plano__coluna"> 
              <div className="plano__item"> 
                <img
                  src="https://placehold.co/250"
                  alt="Plano Básico"
                  className="plano__imagem"
                />
                <h4 className="plano__titulo">Básico</h4>
                <h5 className="plano__preco">R$ XXX,00</h5>
                <ul className="plano__lista">
                  <li>XX Cotas de Agendamentos</li>
                  <li>XX Cotas de Relatórios Simples</li>
                  <li>XX Cotas de Relatórios Detalhados</li>
                  <li>XX Cotas de Relatórios Simples Financeiro</li>
                  <li>XX Pacotes de Agendamentos</li>
                </ul>
                <Button variant="primary" className="plano__botao">
                  Assinar
                </Button>
              </div>
            </Col>
            <Col className="text-center plano__coluna"> 
              <div className="plano__item"> 
                <img
                  src="https://placehold.co/250"
                  alt="Plano Básico"
                  className="plano__imagem"
                />
                <h4 className="plano__titulo">Básico</h4>
                <h5 className="plano__preco">R$ XXX,00</h5>
                <ul className="plano__lista">
                  <li>XX Cotas de Agendamentos</li>
                  <li>XX Cotas de Relatórios Simples</li>
                  <li>XX Cotas de Relatórios Detalhados</li>
                  <li>XX Cotas de Relatórios Simples Financeiro</li>
                  <li>XX Pacotes de Agendamentos</li>
                </ul>
                <Button variant="primary" className="plano__botao">
                  Assinar
                </Button>
              </div>
            </Col>
            <Col className="text-center plano__coluna"> 
              <div className="plano__item"> 
                <img
                  src="https://placehold.co/250"
                  alt="Plano Básico"
                  className="plano__imagem"
                />
                <h4 className="plano__titulo">Básico</h4>
                <h5 className="plano__preco">R$ XXX,00</h5>
                <ul className="plano__lista">
                  <li>XX Cotas de Agendamentos</li>
                  <li>XX Cotas de Relatórios Simples</li>
                  <li>XX Cotas de Relatórios Detalhados</li>
                  <li>XX Cotas de Relatórios Simples Financeiro</li>
                  <li>XX Pacotes de Agendamentos</li>
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
