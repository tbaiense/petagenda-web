import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RouterProvider } from 'react-router-dom'
import MyRouter from "./routes/OurRouter"

import './styles/global.css';
import './styles/variaveis.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={MyRouter}/>
  </StrictMode>,
)
