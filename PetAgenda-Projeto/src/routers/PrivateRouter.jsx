import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/UserContext";
import { useEffect } from 'react';

import api from "../api";

function PrivateRoute({ children }) { 
  const { token } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('valor do token: ', token);

    // Verifica se existe token ou não
    if (!token) {
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

    verifyToken(token);
  },[]);

  return children;
}

export default PrivateRoute;