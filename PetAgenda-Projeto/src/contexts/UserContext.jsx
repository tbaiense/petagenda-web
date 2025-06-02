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

  return (
    //Defino que todos os filhos do elemento pai pode acessar essas informações
    <AuthContext.Provider value={{ getToken, setToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

