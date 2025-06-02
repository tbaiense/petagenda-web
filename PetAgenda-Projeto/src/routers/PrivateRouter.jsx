import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/UserContext";
import { useEffect } from 'react';

import api from "../api";

function PrivateRoute({ children }) { 
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('valor do token: ', getToken());

    // Verifica se existe token ou não
    if (!getToken()) {
      console.error('token inexistente');
      navigate('/login');
      return;
    }
  
    const verifyToken = (token) => {
      console.log('verificando token');
      const authHeader = `Bearer ${token}`;
      fetch(`${api.URL}/auth/verify-token`, {
          method: "POST",
          headers: {
            "Authorization": authHeader
        }})
        .then( response => {
          if (response.status != 200) {
            console.error('token inválido');
            navigate('/login');
          };
        });
    };

    verifyToken(getToken());
  },[]);

  return children;
}

export default PrivateRoute;