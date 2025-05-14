import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import LogoNav from "../assets/LogoNav.png";
import "./NavBarPetAgenda.css";

const NavbarPetAgenda = () => {
  return (
    <Navbar expand="lg" className="py-3 navbar">
      <Container className="navbar_container">
        <Navbar.Brand as={Link} to="/" className="navbar_brand">
          <img src={LogoNav} className="navbar_logo" alt="Logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto navbar_nav">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/sobre">
              Sobre
            </Nav.Link>
            <Nav.Link as={Link} to="/contato">
              Contato
            </Nav.Link>
            <Button
              variant="outline-dark"
              as={Link}
              to="/login"
              className="navbar_button_login"
            >
              Login
            </Button>
            <Button
              className="navbar_button_registrar"
              as={Link}
              to="/registrar"
            >
              Registrar
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarPetAgenda;