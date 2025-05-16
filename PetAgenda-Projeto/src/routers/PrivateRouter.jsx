import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/UserContext";

function PrivateRoute({ children }) {
  const { token } = useAuth();

  // Verifica se existe token ou não
  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;