import { useState, useEffect, createContext, useContext  } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token")); // Por alguma razão só funciona se inicializar também buscando o valor no localStorage :/

  //Aqui pega o token do localStorage quando o app carrega
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token") || ""
    console.log('peguei token do localstorage: ', storedToken);
    setToken(storedToken)
  }, [])

  //Aqui salva o token no estado e no localStorage ao fazer login
  const login = (jwt) => {
    localStorage.setItem("access_token", jwt)
    setToken(jwt)
  }

  //Aqui salva o token do estado e do localStorage ao fazer logout
  const logout = () => {
    localStorage.removeItem("access_token")
    setToken(""); 
  }

  return (
    //Defino que todos os filhos do elemento pai pode acessar essas informações
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

