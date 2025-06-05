import 'bootstrap/dist/css/bootstrap.min.css';
import {Outlet} from "react-router-dom"
import { AuthProvider } from "./contexts/UserContext.jsx";

function App() {
  return (
    <>
        <Outlet/>
    </>
  );
}

export default App;
