// Importando o componente principal
import App from "../App";

// Páginas públicas
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Registrar from "../pages/Registrar/Registrar";

// Empresa
import CadastroEmpresa from "../pages/Empresa/Cadastro_Empresa/CadastroEmpresa";
import PlanosEmpresa from "../pages/Empresa/Planos/PlanosEmpresa";
import ViewEmpresa from "../pages/Empresa/Visualizar_Dados/ViewEmpresa";
import EditarEmpresa from "../pages/Empresa/Editar_Empresa/EditarEmpresa.jsx";
// Funcionários
import CadastroFuncionario from "../pages/Funcionario/CadastroFuncionario/Cadastro_Funcionario";

//Clientes
import CadastrarClientes from "../pages/Clientes/Cadastrar_Clientes";
import ListarClientes from "../pages/Clientes/ListarClientes.jsx";
import EditarCliente from "../pages/Clientes/EditarCliente.jsx";

//Pets
import CadastrarPets from "../pages/Pets/Cadastrar_Pets";
import ListarPets from "../pages/Pets/ListarPets.jsx";
import EditarPets from "../pages/Pets/Editar_Pets.jsx";
//Serviços
import CadastrarServico from "../pages/Servico/CadastrarServico/Cadastrar_Servico";
import Lista_ServicosOferecidos from "../pages/Servico/ListarServicosOferecidos/Lista_ServicosOferecidos.jsx";
import ServicoExecutado from "../pages/Servico/ServicoExecutado/Servico_Executado.jsx";
// Agendamento
import CadastrarAgendamento from "../pages/Agendamentos/Cadastrar/Cadastrar_Agendamento";
import Lista_Agendamento from "../pages/Agendamentos/Lista/Lista_Agendamento.jsx";
import EditarAgendamento from "../pages/Agendamentos/Editar/Editar_Agendamento.jsx";

// Relatórios
import Relatorio_Simples from "../pages/Relatorios/Simples/Relatorio_Simples";
import Relatorio_Detalhado from "../pages/Relatorios/Detalhado/Relatorio_Detalhado";
import Gastos from "../pages/Relatorios/Gastos/Gastos";

// Dashboard
import Dashboard from "../pages/Dashboard/Dashboard.jsx";

// Layout logado
import MenuDashBoard from "../MenuDashboard";

// React Router
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRouter";

const router = createBrowserRouter([
  // Rotas públicas
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/registrar",
        element: <Registrar />,
      },
    ],
  },

  // Área logada da empresa
  {
    path: "/empresa",
    element: (

        <MenuDashBoard />

    ),
    children: [

      // Empresa
      {
        path: "cadastrar",
        element: <CadastroEmpresa />,
      },
      {
        path: "informacoes",
        element: <ViewEmpresa />,
      },
      {
        path: "planos",
        element: <PlanosEmpresa />,
      },
      {
        path: "editar",
        element: <EditarEmpresa />,
      },

      // Funcionários
      {
        path: "funcionarios",
        element: <CadastroFuncionario />,
      },

      // Clientes
      {
        path: "clientes/cadastrar",
        element: <CadastrarClientes />,
      },
      {
        path: "clientes/lista",
        element: <ListarClientes />,
      },
      {
        path: "clientes/editar/:id",
        element: <EditarCliente />,
      },

      // Pets
      {
        path: "pets/cadastrar",
        element: <CadastrarPets />,
      },
      {
        path: "pets/lista",
        element: <ListarPets />,
      },
      {
        path: "pets/editar/:id",
        element: <EditarPets />,
      },

      // Serviços
      {
        path: "servicos/cadastrar",
        element: <CadastrarServico />,
      },
      {
        path: "servicos/lista",
        element: <Lista_ServicosOferecidos />,
      },
      {
        path: "servicos/realizados/cadastrar",
        element: <ServicoExecutado />,
      },

      // Agendamentos
      {
        path: "agendamentos/cadastrar",
        element: <CadastrarAgendamento />,
      },
      {
        path: "agendamentos/lista",
        element: <Lista_Agendamento />,
      },
      {
        path: "agendamentos/editar",
        element: <EditarAgendamento />,
      },

      // Relatórios
      {
        path: "relatorios/simples",
        element: <Relatorio_Simples />,
      },
      {
        path: "relatorios/detalhado",
        element: <Relatorio_Detalhado />,
      },
      {
        path: "relatorios/gastos",
        element: <Gastos />,
      },

      // Dashboard
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
