import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

// Importando o AuthProvider para usar o useAuth nas rotas
import { AuthProvider } from './contexts/UserContext'; 

// Importando as rotas criadas
import router from './routers/OurRouters';

import './styles/global.css';
import './styles/variaveis.css';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  // </StrictMode>
);
