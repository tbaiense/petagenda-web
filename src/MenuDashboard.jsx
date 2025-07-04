import { Outlet } from "react-router-dom";
import { useAuth } from "./contexts/UserContext";
import { Layout, Menu, Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import petAgenda from "./assets/LogoNav.png"
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from "./styles/MenuDashboard.module.css"
import BreadCrumb from './components/Breadcrumb/BreadCrumb'
import iconPerfil from "./assets/icon_perfil.svg";
import {
    FaHome,
    FaUserFriends,
    FaClipboardList,
    FaDog,
    FaCalendar,
    FaHistory,
    FaUsers,
    FaChartBar,
    FaChevronRight,
    FaChevronDown,
    FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

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
    const [drawerVisible, setDrawerVisible] = useState(false);
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        removeToken();
        setUsuario({ id: 0, admin: false });
        setEmpresa({ id: 0, licenca: "corporativo" });
        navigate("/");
    };

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

    const handleMenuClick = ({ key }) => {
        const routes = {
            dashboard: "/empresa/dashboard",
            "ag-novo": "/empresa/agendamentos/cadastrar",
            "ag-lista": "/empresa/agendamentos/lista",
            "ag-realizado": "/empresa/servicos/realizados/cadastrar",
            "pets-novo": "/empresa/pets/cadastrar",
            "pets-lista": "/empresa/pets/lista",
            "clientes-novo": "/empresa/clientes/cadastrar",
            "clientes-lista": "/empresa/clientes/lista",
            funcionarios: "/empresa/funcionarios",
            "servicos-novo": "/empresa/servicos/cadastrar",
            "servicos-lista": "/empresa/servicos/lista",
            "relatorios-simples": "/empresa/relatorios/simples",
            "relatorios-detalhado": "/empresa/relatorios/detalhado",
        };
        if (routes[key]) {
            navigate(routes[key]);
            if (isMobile) setDrawerVisible(false);
        }
    };

    const menuItems = [
        {
            key: "dashboard",
            label: (
                <>
                    {collapsed ? <Link><FaHome /></Link> : "Inicio"}
                </>
            ),
        },
        {
            key: "agendamentos",
            label: (
                <>
                    {collapsed ? <Link to={"/empresa/agendamentos/lista"} style={{color:'inherit'}}><FaCalendar /></Link> : "Agendamentos"}
                </>
            ),
            children: [
                { key: "ag-novo", label: "Novo" },
                { key: "ag-lista", label: "Listar" },
                { key: "ag-realizado", label: "Realizado" },
            ],
        },
        {
            key: "pets",
            label: (
                <>
                    {collapsed ? <Link to={"/empresa/pets/lista"} style={{color:"inherit"}}><FaDog /></Link> : "Pets"}
                </>
            ),
            children: [
                { key: "pets-novo", label: "Novo" },
                { key: "pets-lista", label: "Listar" },
            ],
        },
        {
            key: "clientes",
            label: (
                <>
                    {collapsed ? <Link to={"/empresa/clientes/lista"} style={{color:"inherit"}}><  FaUserFriends /></Link> : "Clientes"}
                </>
            ),
            children: [
                { key: "clientes-novo", label: "Novo" },
                { key: "clientes-lista", label: "Listar" },
            ],
        },
        {
            key: "funcionarios",
            label: (
                <>
                    {collapsed ? <Link to={"/empresa/funcionarios"} style={{color:"inherit"}}>< FaUsers /></Link> : "Funcionários"}
                </>
            ),
        },
        {
            key: "servicos",
            label: (
                <>
                    {collapsed ? <Link to={"/empresa/servicos/lista"} style={{color:"inherit"}}><FaClipboardList /></Link> : "Serviços"}
                </>
            ),
            children: [
                { key: "servicos-novo", label: "Novo" },
                { key: "servicos-lista", label: "Lista" },
            ],
        },
        {
            key: "relatorios",
            label: (
                <>
                    {collapsed ? <FaChartBar /> : "Relatórios"}
                </>
            ),
            children: [
                { key: "relatorios-simples", label: "Simples" },
                { key: "relatorios-detalhado", label: "Detalhado" },
            ],
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {isMobile ? (
                <Header
                    style={{
                        background: "#9d4005",
                        padding: "0 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: 24, color: "#fff" }} />}
                        onClick={() => setDrawerVisible(true)}
                    />

                    <Drawer
                        title="Menu"
                        placement="left"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Menu
                            mode="inline"
                            items={menuItems}
                            onClick={handleMenuClick}
                            openKeys={openKeys}
                            onOpenChange={handleOpenChange}
                        />
                        <div style={{ padding: 16, borderTop: "1px solid #f0f0f0" }}>
                            <Button danger block onClick={handleLogout}>
                                Sair
                            </Button>
                        </div>
                    </Drawer>

                    <div style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
                        <span style={{ color: "#fff" }}>Pet</span>
                        <span style={{ color: "#ffc107", marginLeft: 4 }}>Agenda</span>
                    </div>
                </Header>
            ) : (
                <Sider
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    trigger={collapsed ? <RightOutlined style={{ color: 'white', fontSize: '18px' }} /> : <LeftOutlined style={{ color: 'white', fontSize: '18px' }} />}
                    style={{ background: '#9d4005', position: 'relative' }}>
                    <div style={{ margin: "10px" }}>
                        {collapsed ? (
                            <img src={iconPerfil} className={styles.user_avatar} alt="" />
                        ) : (
                            <Link to={"/empresa/informacoes"}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <img src={iconPerfil} className={styles.user_avatar} alt="avatar" />
                                    <div className={styles.user_infos}>
                                        <span className={`${styles.itemDescription} ${collapsed ? styles.hidden : styles.visible}`}>
                                            Fulano de Tal
                                        </span>
                                        <span className={`${styles.itemDescription} ${collapsed ? styles.hidden : styles.visible}`}>
                                            Administrador
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: 150,
                            right: -20,
                            width: 20,
                            height: 60,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: '#7a2f02',
                            borderRadius: '0 4px 4px 0',
                            zIndex: 10,
                        }}
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <RightOutlined style={{ color: 'white' }} /> : <LeftOutlined style={{ color: 'white' }} />}
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        openKeys={openKeys}
                        onOpenChange={handleOpenChange}
                        style={{ background: "#9d4005" }}
                        items={menuItems}
                        onClick={handleMenuClick}
                    />
                    <div style={{ padding: 16 }}>
                        <Button danger block onClick={handleLogout}>
                            Sair
                        </Button>
                    </div>
                </Sider>
            )}

            <Layout style={{ background: isMobile ? "white" : '#fff8f0' }}>
                {!isMobile && (
                    <Header style={{ background: "#fff8f0", paddingLeft: '1rem', textAlign: "left" }}>
                        <img src={petAgenda} alt="" />
                    </Header>
                )}
                <Content style={{ marginLeft: "16px", marginRight: '16px', marginTop: "0px" }}>
                    {isMobile ? "" : <BreadCrumb />}

                    <div style={{
                        padding: isMobile ? "0" : "24",
                        minHeight: "87vh",
                        background: isMobile ? "transparent" : "#fff",
                        overflowY: "auto",
                        maxHeight: "87vh"
                    }} className={styles.vaiSeFerrar}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MenuDashBoard;
