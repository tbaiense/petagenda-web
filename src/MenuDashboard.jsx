import SideBar from "./components/SideBar/SideBar";
import LogoPetAgenda from "./components/LogoPet/LogoPetAgenda";
import { Outlet } from "react-router-dom";
import styles from "./styles/MenuDashboard.module.css";
import { useAuth } from "./contexts/UserContext";
import { Layout, Menu } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MenuDashBoard = () => {
  const { removeToken, setUsuario, setEmpresa, validar } = useAuth();
  if (!validar) {
    console.log("EM MODO DE DESENVOLVIMENTO: SEM VALIDAÇÃO DE CREDENCIAIS!");
    removeToken();
    setUsuario({ id: 0, admin: false });
    setEmpresa({ id: 0, licenca: "corporativo" });
  }

  const { Header, Content, Sider } = Layout;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [openKeys, setOpenKeys] = useState([]);

  const handleOpenChange = (keys) => {
    const latestKey = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(latestKey ? [latestKey] : []);
  };

  const menuItems = [
    {
      key: "dashboard",
      label: "Início",
      onClick: () => navigate("/empresa/dashboard"),
    },
    {
      key: "agendamentos",
      label: "Agendamentos",
      children: [
        {
          key: "ag-novo",
          label: "Novo",
          onClick: () => navigate("/empresa/agendamentos/cadastrar"),
        },
        {
          key: "ag-lista",
          label: "Listar",
          onClick: () => navigate("/empresa/agendamentos/lista"),
        },
        {
          key: "ag-realizado",
          label: "Realizado",
          onClick: () => navigate("/empresa/servicos/realizados/cadastrar"),
        },
      ],
    },
    {
      key: "pets",
      label: "Pets",
      children: [
        {
          key: "pets-novo",
          label: "Novo",
          onClick: () => navigate("/empresa/pets/cadastrar"),
        },
        {
          key: "pets-lista",
          label: "Listar",
          onClick: () => navigate("/empresa/pets/lista"),
        },
      ],
    },
    {
      key: "clientes",
      label: "Clientes",
      children: [
        {
          key: "clientes-novo",
          label: "Novo",
          onClick: () => navigate("/empresa/clientes/cadastrar"),
        },
        {
          key: "clientes-lista",
          label: "Listar",
          onClick: () => navigate("/empresa/clientes/lista"),
        },
      ],
    },
    {
      key: "funcionarios",
      label: "Funcionários",
      onClick: () => navigate("/empresa/funcionarios"),
    },
    {
      key: "servicos",
      label: "Serviços Oferecidos",
      children: [
        {
          key: "servicos-novo",
          label: "Novo",
          onClick: () => navigate("/empresa/servicos/cadastrar"),
        },
        {
          key: "servicos-lista",
          label: "Lista",
          onClick: () => navigate("/empresa/servicos/lista"),
        },
      ],
    },
    {
      key: "relatorios",
      label: "Relatórios",
      children: [
        {
          key: "relatorios-simples",
          label: "Simples",
          onClick: () => navigate("/empresa/relatorios/simples"),
        },
        {
          key: "relatorios-detalhado",
          label: "Detalhado",
          onClick: () => navigate("/empresa/relatorios/detalhado"),
        },
      ],
    },
  ];

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        {isMobile ? (
          <Header style={{ background: "#9d4005", padding: 0 }}>
            <Menu
              mode="horizontal"
              theme="dark"
              style={{ background: "#9d4005" }}
              defaultSelectedKeys={["1"]}
              items={menuItems}
              openKeys={openKeys}
              onOpenChange={handleOpenChange}
            />
          </Header>
        ) : (
          <Sider collapsible style={{ background: "#9d4005" }}>
            <div
              style={{
                height: 32,
                margin: 16,
                background: "rgba(255,255,255,0.2)",
              }}
            />
            <Menu
              theme="dark"
              mode="inline"
              openKeys={openKeys}
              onOpenChange={handleOpenChange}
              defaultSelectedKeys={["1"]}
              style={{ background: "#9d4005" }}
              items={menuItems}
            />
          </Sider>
        )}

        <Layout>
          {!isMobile && (
            <Header
              style={{ background: "#fff", padding: 0, textAlign: "center" }}
            >
              <h1 style={{ margin: 0 }}>PetAgenda</h1>
            </Header>
          )}

          <Content style={{ margin: "16px" }}>
            <div style={{ padding: 24, minHeight: "90vh", background: "#fff" }}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default MenuDashBoard;
