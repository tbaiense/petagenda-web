import { useState, useEffect, createContext, useContext  } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("")

  //Aqui pega o token do localStorage quando o app carrega
  useEffect(() => {
    const storedToken = localStorage.getItem("token") || ""
    setToken(storedToken)
  }, [])

  //Aqui salva o token no estado e no localStorage ao fazer login
  const login = (data) => {
    localStorage.setItem("token", data.token)
    setToken(data.token)
  }

  //Aqui salva o token do estado e do localStorage ao fazer logout
  const logout = () => {
    localStorage.removeItem("token")
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
