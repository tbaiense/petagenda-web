import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/UserContext";

function PrivateRoute({ children }) {
  const { token } = useAuth();

  // Verifico se existe token ou não
  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;