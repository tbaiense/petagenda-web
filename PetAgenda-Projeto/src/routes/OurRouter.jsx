import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import PaginaErro from "./pages/PaginaErro/PaginaErro.jsx";
import Login from "./pages/Login/Login.jsx";
import Home from "./pages/Home/Home.jsx";
import Usuario from "./pages/Usuario/Usuario.jsx";
import Empresa from "./pages/Empresa/Empresa.jsx";
import Licenca from "./pages/Empresa/Licenca.jsx";
import CadastroEmpresa from "./pages/Empresa/CadastroEmpresa.jsx";
import TrocaDados from "./pages/Empresa/TrocaDados.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import CadastrarCliente from "./pages/Cliente/CadastrarCliente.jsx";
import CadastrarPets from "./pages/Pets/CadastrarPets.jsx";
import CadastrarFuncionario from "./pages/Funcionario/CadastrarFuncionario.jsx";
import AgendamentoNormal from "./pages/Agendamento/AgendamentoNormal.jsx";
import AgendamentoRecorrente from "./pages/Agendamento/AgendamentoRecorrente.jsx";
import ServicoExecutado from "./pages/Agendamento/ServicoExecutado.jsx";
import HistoricoAgendamentos from "./pages/Historico/HistoricoAgendamentos.jsx";
import HistoricoInicidentes from "./pages/Historico/HistoricoIncidentes.jsx";
import CadastrarServico from "./pages/Servicos/CadastrarServico.jsx";
import Relatorios from "./pages/Relatorios/Relatorios.jsx";


const router = createBrowserRouter([
    {
      path:"/home",
      element:<App/>,
      errorElement:<PaginaErro/>,
      children:[
          {
            path:"/home",
            element: <Home/>,
          },
          {
            path:"/login",
            element:<Login/>,
          },
        ]
    },
    {
      path:"/usuario",
      element:<Usuario/>,
      children:[
        {
          path:"/usuario/empresa",
          element:<Empresa/>,
        },
        {
          path:"/usuario/licenca",
          element:<Licenca/>,
        },
        {
          path:"/usuario/cadastroEmpresa",
          element:<CadastroEmpresa/>,
        },
        {
          path:"/usuario/trocaDados",
          element:<TrocaDados/>,
        },
      ]
    },
    {
      path:"/menu",
      element:<Dashboard/>,
      children:[
        {
          path:"/cadastroCliente",
          element: <CadastrarCliente/>,
        },
        {
          path:"/cadastroPet",
          element: <CadastrarPets/>,
        },
        {
          path:"/cadastroFuncionario",
          element: <CadastrarFuncionario/>,
        },
        {
          path:"/agendamentoNormal",
          element: <AgendamentoNormal/>,
        },
        {
          path:"/agendamentoRecorrente",
          element: <AgendamentoRecorrente/>,
        },
        {
          path:"/servicoExecutado",
          element: <ServicoExecutado/>,
        },
        {
          path:"/historicoAgendamentos",
          element: <HistoricoAgendamentos/>,
        },
        {
          path:"/historicoInicidentes",
          element: <HistoricoInicidentes/>,
        },
        {
          path:"/CadastrarServico",
          element: <CadastrarServico/>,
        },
        {
          path:"/relatorios",
          element: <Relatorios/>,
        },
      ]
    }
])

export default router