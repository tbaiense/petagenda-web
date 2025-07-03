import SideBar from "./components/SideBar/SideBar";
import LogoPetAgenda from "./components/LogoPet/LogoPetAgenda";
import { Outlet } from "react-router-dom";
import styles from "./styles/MenuDashboard.module.css";
import { useAuth } from "./contexts/UserContext";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useEffect } from "react";

const MenuDashBoard = () => {
  const { removeToken, setUsuario, setEmpresa, validar } = useAuth();
  if (!validar) {
    console.log("EM MODO DE DESENVOLVIMENTO: SEM VALIDAÇÃO DE CREDENCIAIS!");
    removeToken();
    setUsuario({ id: 0, admin: false });
    setEmpresa({ id: 0, licenca: "corporativo" });
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          <Navbar expand="lg" className="" style={{ backgroundColor: "#9d4005" }}>
            <Container fluid>
              <Navbar.Brand href="#"><span>Pet</span><span>Agenda</span></Navbar.Brand>
              <Navbar.Toggle aria-controls="offcanvasNavbar" />
              <Navbar.Offcanvas
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="end"
                style={{ backgroundColor: "#9d4005"}}
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id="offcanvasNavbarLabel">
                    Menu
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link href="/empresa/dashboard">Início</Nav.Link>

                    <NavDropdown title="Agendamentos" id="nav-dropdown" style={{ backgroundColor: "#9d4005" }} className={styles.porfavorDeus}>
                      <NavDropdown.Item href="/empresa/agendamentos/cadastrar">
                        Novo Agendamento
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/empresa/agendamentos/lista">
                        Listar
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/empresa/servicos/realizados/cadastrar">
                        Serviço Realizado
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Pet" id="nav-dropdown" style={{ backgroundColor: "#9d4005" }}>
                      <NavDropdown.Item href="/empresa/pets/cadastrar">
                        Novo Pet
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/empresa/pets/lista">
                        Listar Pets
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Cliente" id="nav-dropdown">
                      <NavDropdown.Item href="/empresa/clientes/cadastrar">
                        Novo Cliente
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/empresa/clientes/lista">
                        Listar Cliente
                      </NavDropdown.Item>
                    </NavDropdown>

                    <Nav.Link href="/empresa/funcionarios">Funcionários</Nav.Link>

                    <NavDropdown title="Serviços Oferecidos" id="" style={{ backgroundColor: "#9d4005" }}>
                      <NavDropdown.Item href="/empresa/servicos/cadastrar" style={{ backgroundColor: "#9d4005" }}>
                        Novo Serviço
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/empresa/servicos/lista" style={{ backgroundColor: "#9d4005" }}>
                        Listar Serviços
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Relatórios" id="nav-dropdown" style={{ backgroundColor: "#9d4005" }}>
                      <NavDropdown.Item href="/empresa/relatorios/simples">
                        Simples
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/empresa/relatorios/detalhado">
                        Detalhado
                      </NavDropdown.Item>
                    </NavDropdown>

                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>

          <div style={{backgroundColor: "white"}}>
            <Outlet />
          </div>
        </>
      ) : (
        <div className={styles.layoutDashboard}>
          <SideBar />
          <div>
            <LogoPetAgenda />
            <div className={styles.navBarEmpresa}>
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuDashBoard;
