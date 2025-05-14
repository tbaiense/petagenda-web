import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <section className="home_section">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h1 className="home_title">
              Organize os cuidados do seu pet com facilidade
            </h1>
            <p className="home_paragraph">
              O PetAgenda é uma plataforma feita para empreendedores e donos de
              petshops que buscam gerenciar agendamentos de forma rápida, segura
              e profissional.
            </p>
            <Button as={Link} to="/registrar" className="home_button">
              Comece Agora
            </Button>
          </Col>
          <Col md={6} className="text-center">
            <img
              src="https://placehold.co/800x640"
              alt="Ilustração de pet"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
      <Container>
        
      </Container>
    </section>
  );
}

export default Home;
