import { useNavigate } from "react-router-dom";
import { useAuth, AuthProvider } from "../contexts/UserContext";
import { useEffect, useState } from 'react';

import api from "../api";

function PrivateRoute({ children }) { 
  const { getToken, validar, setValidar } = useAuth();
  const navigate = useNavigate();

  const [ done, setDone ] = useState(false);

  console.log("[PrivateRoute] Carregando...")
  let content;
  console.log('valor do token: ', getToken());
  console.log('valor validar atual: ', validar);

  useEffect(() => {
    if (!validar) {
      navigate('/login');
    }
  
    console.log('valor validar depois: ', validar);

    setValidar(true);

    console.log("[PrivateRoute] Executando useEffect...")

    // Verifica se existe token ou não
    if (!getToken()) {
      console.error('token inexistente');
      navigate('/login');
      return;
    }
  
    const verifyToken = (token) => {
      let done = false;

      console.log('verificando token: ', token);
      const authHeader = `Bearer ${token}`;
      fetch(`${api.URL}/auth/verify-token`, {
          method: "POST",
          headers: {
            "Authorization": authHeader
        }})
        .then( response => {
          if (response.status != 200) {
            setDone(false);
            console.error('token inválido');
            navigate('/login');
          } else {
            setDone(true);
          };
        });
    };

    verifyToken(getToken());
  },[]);

  return (
    <>
      {done && children}
    </>
  );
}

export default PrivateRoute;