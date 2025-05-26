//Importando o elemento pai
import App from "../App";

//Importando as paginas que vamos usar
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Registrar from "../pages/Registrar/Registrar";
import CadastroEmpresa from "../pages/Empresa/Cadastro_Empresa/CadastroEmpresa";
import PlanosEmpresa from "../pages/Planos/PlanosEmpresa";
import MenuDashBoard from "../MenuDashboard";
import ViewEmpresa from "../pages/Empresa/Visualizar_Dados/ViewEmpresa"

//Importando os metodos de navegações
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRouter";


const router = createBrowserRouter([
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
    ]
  },
  // Esse elemento pai não vai ser o dashboard porque ele é para cadastrar a empresa
  {
    path: "/dashboard",
    element: (
      //<PrivateRoute>
        <MenuDashBoard />
      //</PrivateRoute>
    ),
    children:[
      {
        path: "empresa",
        element: (
          //<PrivateRoute>
            <ViewEmpresa/>
          //</PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          //<PrivateRoute>
            <CadastroEmpresa />
          //</PrivateRoute>
        ),
      },
      {
        path: "Planos",
        element: (
          // <PrivateRoute>
            <PlanosEmpresa />
          // </PrivateRoute>
        ),
      },
    ]
  },
]);

export default router;
