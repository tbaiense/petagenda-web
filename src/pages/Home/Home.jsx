import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavBarPetAgenda from "../../components/NavBar/NavBarPetAgenda";
import "./Home.css";
import imgNote from "../../assets/ImagensHome/Note.png";
import imgTimer from "../../assets/ImagensHome/Timer.png";
import imgLayout from "../../assets/ImagensHome/Layout.png";
import image1 from "../../assets/ImagensProjeto/pet1.png";
import image2 from "../../assets/ImagensProjeto/pet2.png";
import image3 from"../../assets/ImagensProjeto/pet3.png";
import image4 from "../../assets/ImagensProjeto/pet4.png";
function Home() {
  return (
    <div>
      <NavBarPetAgenda />
      <section className="home__section">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="home__title home__sulucao">
                Organize os cuidados do seu pet com facilidade
              </h1>
              <p className="home__paragraph">
                O PetAgenda é uma plataforma feita para empreendedores e donos
                de petshops que buscam gerenciar agendamentos de forma rápida,
                segura e profissional.
              </p>
              <Button as={Link} to="/registrar" className="home__button mb-3">
                Comece Agora
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <img
                src={image1}
                alt="Ilustração de pet"
                className="img-fluid home__imagem"
              />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="home__section">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col md={8} className="text-center">
              <h2 className="home__title">
                Por que o PetAgenda é a melhor solução para seu petshop?
              </h2>
            </Col>
          </Row>
          <Row className="text-center">
            <Col md={4}>
              <img src={imgNote} alt="Agendamentos organizados" className="mb-4 home__icon" />
              <h3 className="home__subtitle home__sulucao mb-3">
                Agendamentos 100% organizados
              </h3>
              <p className="home__paragraph">
                Centralize tudo em um só lugar, com alertas e histórico de cada pet e cliente.
              </p>
            </Col>
            <Col md={4}>
              <img src={imgTimer} alt="Ganhe tempo" className="mb-4 home__icon" />
              <h3 className="home__subtitle home__sulucao mb-3">
                Ganhe tempo e profissionalismo
              </h3>
              <p className="home__paragraph">
                Mostre profissionalismo com um sistema moderno que valoriza seu trabalho.
              </p>
            </Col>
            <Col md={4}>
              <img src={imgLayout} alt="Interface intuitiva" className="mb-4 home__icon" />
              <h3 className="home__subtitle home__sulucao mb-3">
                Interface simples e intuitiva
              </h3>
              <p className="home__paragraph">
                Plataforma fácil de usar, ideal mesmo para quem não tem familiaridade com tecnologia.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="home__section">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="home__title">
                Gerencie agendamentos de forma profissional e sem complicações
              </h2>
              <p className="home__paragraph">
                Evite confusões, economize tempo e tenha controle total da
                agenda do seu petshop.
              </p>
              <ul className="home__list">
                <li>Atendimento organizado e pontual</li>
                <li>Redução de erros e retrabalhos</li>
                <li>Maior confiança do cliente no serviço</li>
                <li>Controle completo dos serviços</li>
              </ul>
              <Button
                as={Link}
                to="/registrar"
                className="home__button__outline mt-4"
              >
                Comece Agora
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <img
                src={image3}
                alt="Gerenciamento profissional"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;