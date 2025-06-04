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

// Funcionários, Clientes, Pets, Serviços
import CadastroFuncionario from "../pages/Funcionario/CadastroFuncionario/Cadastro_Funcionario";
import CadastrarClientes from "../pages/Clientes/Cadastrar_Clientes";
import CadastrarPets from "../pages/Pets/Cadastrar_Pets";
import CadastrarServico from "../pages/Servico/CadastrarServico/Cadastrar_Servico";

// Agendamento
import Agendamento from "../pages/Agendamentos/Cadastrar/Cadastrar_Agendamento";

// Relatórios
import RelatorioSimples from "../pages/Relatorios/Simples/Relatorio_Simples";
import RelatorioDetalhado from "../pages/Relatorios/Detalhado/Relatorio_Detalhado";
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
      // <PrivateRoute>
      <MenuDashBoard />
      // </PrivateRoute>
    ),
    children: [
      // Empresa
      {
        path: "cadastrar",
        element: (
          // <PrivateRoute>
          <CadastroEmpresa />
          // </PrivateRoute>
        ),
      },
      {
        path: "informacoes",
        element: (
          // <PrivateRoute>
          <ViewEmpresa />
          // </PrivateRoute>
        ),
      },
      {
        path: "planos",
        element: (
          // <PrivateRoute>
          <PlanosEmpresa />
          // </PrivateRoute>
        ),
      },

      // Funcionários, clientes, pets
      {
        path: "funcionarios",
        element: (
          // <PrivateRoute>
          <CadastroFuncionario />
          // </PrivateRoute>
        ),
      },
      {
        path: "clientes/cadastrar",
        element: (
          // <PrivateRoute>
          <CadastrarClientes />
          // </PrivateRoute>
        ),
      },
      {
        path: "pets/cadastrar",
        element: (
          // <PrivateRoute>
          <CadastrarPets />
          // </PrivateRoute>
        ),
      },

      // Serviços
      {
        path: "servicos/cadastrar",
        element: (
          // <PrivateRoute>
          <CadastrarServico />
          // </PrivateRoute>
        ),
      },

      // Agendamentos
      {
        path: "agendamentos",
        element: (
          // <PrivateRoute>
          <Agendamento />
          // </PrivateRoute>
        ),
      },

      // Relatórios
      {
        path: "relatorio/simples",
        element: (
          // <PrivateRoute>
          <RelatorioSimples />
          // </PrivateRoute>
        ),
      },
      {
        path: "relatorio/detalhado",
        element: (
          // <PrivateRoute>
          <RelatorioDetalhado />
          // </PrivateRoute>
        ),
      },
      {
        path: "relatorio/gastos",
        element: (
          // <PrivateRoute>
          <Gastos />
          // </PrivateRoute>
        ),
      },

      // Dashboard
      {
        path: "dashboard",
        element: (
          // <PrivateRoute>
          <Dashboard />
          // </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
