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

  //Aqui vai gerar o token quando o usuario se registrar
  const gerarToken = (usuario) => {
    //tudo que estiver dentro do token false, vai ser transformado em token, essa não é a forma correta de fazer
  const tokenFalse = {
    email: usuario.email,
    data: new Date().toISOString(), // uma informação adicional para criar um token
    senha: usuario.resposta
  };
  return btoa(JSON.stringify(payload));
}

  return (
    //Defino que todos os filhos do elemento pai pode acessar essas informações
    <AuthContext.Provider value={{ token, login, logout, gerarToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
