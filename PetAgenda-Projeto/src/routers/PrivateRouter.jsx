import { useNavigate } from "react-router-dom";
import { useAuth, AuthProvider } from "../contexts/UserContext";
import { useEffect, useState } from 'react';

function PrivateRoute({ children }) { 
  const { getToken, validar, setValidar, apiFetch } = useAuth();
  const navigate = useNavigate();

  const [ done, setDone ] = useState(false);

  const verifyToken = () => {
    let done = false;
  
    const authHeader = `Bearer ${getToken()}`;
    apiFetch(`/auth/verify-token`, {
        method: "POST",
        headers: {
          "Authorization": authHeader
      }})
      .then( response => {
        if (response.status != 200) {
          setDone(false);
          console.log('[PrivateRouter] Token inválido');
          navigate('/login');
        } else {
          setDone(true);
          console.log('[PrivateRouter] Token válido!');
        };
      });
  };

  useEffect(() => {
    setValidar(true);
    
    console.log('[PrivateRouter] Verificando token: ', getToken());
    // Verifica se existe token ou não
    if (!getToken()) {
      console.log('[PrivateRouter] Token inexistente...');
      navigate('/login');
      return;
    }

    verifyToken();
  },[]);

  

  return (
    <>
      {done && children}
    </>
  );
}

export default PrivateRoute;