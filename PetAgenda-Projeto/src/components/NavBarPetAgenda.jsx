import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import LogoNav from "../assets/LogoNav.png";
import "./NavBarPetAgenda.css";

const NavbarPetAgenda = () => {
  return (
    <Navbar expand="lg" fixed="top" className="navbar-petagenda">
      <Container className="container__navbar">
        <Navbar.Brand as={Link} to="/">
          <img src={LogoNav} alt="Logo PetAgenda" className="navbar-logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link}>Home</Nav.Link>
            <Nav.Link as={Link}>Sobre</Nav.Link>
            <Nav.Link as={Link}>Contato</Nav.Link>
            <Button variant="outline-dark" as={Link} to="/login" className="btn-login">
              Login
            </Button>
            <Button as={Link} to="/registrar" className="btn-registrar">
              Registrar
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarPetAgenda;
