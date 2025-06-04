import { useState, useEffect, createContext, useContext  } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const tokenKey = 'access_token';

  //Aqui salva o token no estado e no localStorage ao fazer login
  const setToken = (jwt) => {
    localStorage.setItem(tokenKey, jwt)
  }
  
  const getToken = () => {
    return localStorage.getItem(tokenKey);
  }

  //Aqui salva o token do estado e do localStorage ao fazer logout
  const removeToken = () => {
    localStorage.removeItem(tokenKey)
  }

  // Definições de usuário
  const usuario_idKey = 'usuario_id';
  const usuario_adminKey = 'usuario_admin';

  const setUsuario = (usr) => {
    const {
      id, admin
    } = usr;

    localStorage.setItem(usuario_idKey, id);
    localStorage.setItem(usuario_adminKey, admin);
  };

  const getUsuario = () => {
    const id = localStorage.getItem(usuario_idKey);

    return (id) ? {
      id: id,
      admin: localStorage.getItem(usuario_adminKey)
    } : undefined;
  };

  const removeUsuario = () => {
    localStorage.setItem(usuario_idKey, "");
    localStorage.setItem(usuario_adminKey, "");
  }

  // Definições da empresa atual
  const empresa_idKey = 'empresa_id';
  const empresa_licencaKey = 'empresa_licenca';

  const setEmpresa = (emp) => {
    const {
      id, licenca
    } = emp;

    localStorage.setItem(empresa_idKey, id);
    localStorage.setItem(empresa_licencaKey, licenca);
  };

  const getEmpresa = () => {
    const id = localStorage.getItem(empresa_idKey);

    return (id) ? {
      id: id,
      licenca: localStorage.getItem(empresa_licencaKey)
    } : undefined;
  };

  const removeEmpresa = () => {
    localStorage.setItem(empresa_idKey, "");
    localStorage.setItem(empresa_licencaKey, "");
  };

  return (
    //Defino que todos os filhos do elemento pai pode acessar essas informações
    <AuthContext.Provider value={{ 
      getToken, setToken, removeToken, 
      setUsuario, getUsuario, removeUsuario,
      setEmpresa, getEmpresa, removeEmpresa
     }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

