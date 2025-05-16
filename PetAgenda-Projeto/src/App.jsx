import 'bootstrap/dist/css/bootstrap.min.css';
<<<<<<< HEAD
import AppRoutes from './routes/AppRoutes';
import NavbarPetAgenda from './components/NavbarPetAgenda';
import FooterPetAgenda from './components/FooterPetAgenda';
function App() {
  return (
    <>
      <NavbarPetAgenda />
      <AppRoutes />
      <FooterPetAgenda />
=======
import {Outlet} from "react-router-dom"
import { AuthProvider } from "./contexts/UserContext.jsx";

function App() {
  return (
    <>
      <AuthProvider>
          <Outlet/>
      </AuthProvider>
>>>>>>> main
    </>
  );
}

export default App;
