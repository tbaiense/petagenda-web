//Importando o elemento pai
import App from "../App"

//Importando as paginas que vamos usar
import Home from "../pages/Home/Home"
import Login from "../pages/Login/Login"
import Registrar from "../pages/Registrar/Registrar"

//Importando os metodos de navegações
import { createBrowserRouter } from "react-router-dom"
import PrivateRoute from "./PrivateRouter"
import MenuDashBoard from "../components/MenuDashboard"
import CadastroEmpresa from "../pages/Empresa/CadastroEmpresa"


const router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                path:"/",
                element:<Home/>,
            },
            {
                path:"/login",
                element:<Login/>,
            },
            {
                path:"/registrar",
                element:<Registrar/>,
            },
            {
                path:"/andamento",
                element:(
                    // <PrivateRoute>
                        <MenuDashBoard/>
                    // </PrivateRoute>
                )
            },
            {
                path:"/perfilempresa",
                element:(
                    <PrivateRoute>
                        <CadastroEmpresa/>
                    </PrivateRoute>
                )
            }
        ]
    },
])

export default router