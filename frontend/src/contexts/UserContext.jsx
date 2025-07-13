import { useState, createContext, useContext  } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // URL da API
  const apiURL = 'http://localhost:8080/api/v1';


  const [ validar, setValidar ] = useState(false);
  
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
    console.log('usuario atualizado: ', usr?.id);

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
    localStorage.removeItem(usuario_idKey);
    localStorage.removeItem(usuario_adminKey);
  }

  // Definições da empresa atual
  const empresa_idKey = 'empresa_id';

  const setEmpresa = (emp) => {
    console.log('empresa atualizada: ', emp);

    const {
      id, licenca
    } = emp;

    localStorage.setItem(empresa_idKey, id);
    if (licenca) {
      setLicenca(licenca);
    } else {
      removeLicenca();
    }
  };

  const getEmpresa = () => {
    const id = localStorage.getItem(empresa_idKey);

    return (id) ? {
      id: id,
      licenca: getLicenca()
    } : undefined;
  };

  const removeEmpresa = () => {
    localStorage.removeItem(empresa_idKey);
    removeLicenca();
  };

  // Licenca da empresa
  const empresa_licencaKey = 'empresa_licenca';

  const setLicenca = (licenca) => {
    console.log('licenca atualizada: ', licenca);
    localStorage.setItem(empresa_licencaKey, licenca);
  };

  const getLicenca = () => {
    const licenca = localStorage.getItem(empresa_licencaKey);
    return (licenca?.length) ? licenca : undefined;
  };

  const removeLicenca = () => {
    localStorage.removeItem(empresa_licencaKey);
  };


  function deveRodar() {
    if (!validar) {
        const msg = 'Operação não permitida em modo de desenvolvimento (sem back-end)';
        // alert(msg);
        console.error(msg);
        // throw Error(msg);
    }
  }
  
  function apiFetch(path, opts) {
    const urlFinal = `${apiURL}${path}`;
  
    if (!opts) {
      opts = {};
    }

    if (!opts.headers) {
      opts.headers = {};

    }
    if (!opts.headers["Content-Type"]) {
      opts.headers["Content-Type"] = "application/json";
    }

    return fetch(urlFinal, opts);
  }
  
  function empresaFetch(path, opts) {
    deveRodar();

    // Sobre escrevendo opts
    if (!opts) {
      opts = {};
    }

    if (!opts.headers) {
      opts.headers = {
        "Authorization": `Bearer ${getToken()}`
      };
    }

    const urlFinal = `/empresa/${getEmpresa().id}${path}`;
    return apiFetch(urlFinal, opts);
  }

  return (
    //Defino que todos os filhos do elemento pai pode acessar essas informações
    <AuthContext.Provider value={{ 
      getToken, setToken, removeToken, 
      setUsuario, getUsuario, removeUsuario,
      setEmpresa, getEmpresa, removeEmpresa,
      setLicenca, getLicenca, removeLicenca,
      validar, setValidar, apiFetch, empresaFetch, apiURL
     }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

