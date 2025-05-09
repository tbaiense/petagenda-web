/*
Script de roteamento de caminhos para o servidor de back-end para o 
PetAgenda.
=========================================================================
Versão: 0.0.1
Data: 28/04/2025
Descrição:
    Define as rotas do servidor back-end e as associa aos métodos 
    relevantes.
=========================================================================
*/

const routes = [
    {
        route: /^\/usuario/,
        subRoutes: [
            {
                route: /^\/usuario$/,
                methods: ["POST", "GET", "PUT", "DELETE"],
                handler: () => {console.log('rodou usr!')},
            },
            {
                route: /^\/usuario\/\d+$/,
                methods: ["POST", "GET", "PUT", "DELETE"],
                handler: () => {console.log('rodou usr 1!')},
            },
            {
                route: /^\/usuario\/login$/,
                methods: ["POST"],
                handler: () => {console.log('rodou login!')},
            },
        ]
    },
    {
        route: /^\/empresa/,
        subRoutes: [

        ]
    }
];

function router (req, res) {
    const path = req.url;

}

export default router;
