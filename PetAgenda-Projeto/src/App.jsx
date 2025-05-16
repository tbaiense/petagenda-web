import 'bootstrap/dist/css/bootstrap.min.css';
import {Outlet} from "react-router-dom"
import { AuthProvider } from "./contexts/UserContext.jsx";

function App() {
  return (
    <>
      <AuthProvider>
          <Outlet/>
      </AuthProvider>
    </>
  );
}

export default App;
