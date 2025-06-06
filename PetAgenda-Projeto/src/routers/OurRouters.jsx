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
import CadastrarAgendamento from "../pages/Agendamentos/Cadastrar/Cadastrar_Agendamento";

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
       //<PrivateRoute>
        <MenuDashBoard />
        //</PrivateRoute>
    ),
    children: [
      // Empresa
      {
        path: "cadastrar",
        element: (
          <CadastroEmpresa />
        ),
      },
      {
        path: "informacoes",
        element: (
          <ViewEmpresa />
        ),
      },
      {
        path: "planos",
        element: (
          <PlanosEmpresa />
        ),
      },

      // Funcionários, clientes, pets
      {
        path: "funcionarios",
        element: (
          <CadastroFuncionario />
        ),
      },
      {
        path: "clientes/cadastrar",
        element: (
          <CadastrarClientes />
        ),
      },
      {
        path: "pets/cadastrar",
        element: (
          <CadastrarPets />
        ),
      },

      // Serviços
      {
        path: "servicos/cadastrar",
        element: (
          <CadastrarServico />
        ),
      },

      // Agendamentos
      {
        path: "agendamentos/cadastrar",
        element: (
          <CadastrarAgendamento />
        ),
      },
      {
        path: "agendamentos/lista",
        element: (
          <CadastrarAgendamento />
        ),
      },

      // Relatórios
      {
        path: "relatorio/simples",
        element: (
          <RelatorioSimples />
        ),
      },
      {
        path: "relatorio/detalhado",
        element: (
          <RelatorioDetalhado />
        ),
      },
      {
        path: "relatorio/gastos",
        element: (
          <Gastos />
        ),
      },

      // Dashboard
      {
        path: "dashboard",
        element: (
          <Dashboard />
        ),
      },
    ],
  },
]);

export default router;
