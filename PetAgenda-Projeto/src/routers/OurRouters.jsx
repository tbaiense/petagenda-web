//Importando o elemento pai
import App from "../App"

//Importando as paginas que vamos usar
import Home from "../pages/Home/Home"
import Login from "../pages/Login/Login"
import Registrar from "../pages/Registrar/Registrar"
import PageTeste from "../routers/PageTeste"

//Importando os metodos de navegações
import { createBrowserRouter } from "react-router-dom"
import PrivateRoute from "./PrivateRouter"


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
                path:"/teste",
                element:(
                    //Só pode entrar nessa rota se tiver token
                    <PrivateRoute>
                        <PageTeste/>
                    </PrivateRoute>
                )
            }
        ]
    },
])

export default router