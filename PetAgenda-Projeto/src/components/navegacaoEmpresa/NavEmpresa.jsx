import { Link } from "react-router-dom";
import styles from "./NavEmpresa.module.css";
import { useAuth } from "../../contexts/UserContext";

const NavEmpresa = () => {
  const { validar, getEmpresa } = useAuth();
  const infoEmpresa = getEmpresa();
  let temEmpresa = infoEmpresa?.id;
  return (
    <div className={styles.navBarEmpresa}>
      {/* Não vamos usar o LINK para navergar entre as paginas, vamos usar o onClick para fazer verificação e depois navegar pelas páginas */}
      {!temEmpresa || !validar ? (
        <button>
          <Link to="/empresa/cadastrar">Cadastrar Empresa</Link>
        </button>
      ) : undefined}

      {temEmpresa || !validar ? (
        <>
          <button>
            <Link to="/empresa/informacoes">Informações</Link>
          </button>
          <button>
            <Link to="/empresa/planos">
              {infoEmpresa?.licenca ? "Atualizar" : "Adquirir"} Licença
            </Link>
          </button>
        </>
      ) : undefined}
    </div>
  );
};

export default NavEmpresa;
