//Importando a renderização das navegações
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

//Importando as rotas criadas
import router from './routers/OurRouters';


import './styles/global.css';
import './styles/variaveis.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

