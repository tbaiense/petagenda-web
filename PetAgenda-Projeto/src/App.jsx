import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from './routes/AppRoutes';
import NavbarPetAgenda from './components/NavbarPetAgenda';
import FooterPetAgenda from './components/FooterPetAgenda';
function App() {
  return (
    <>
      <NavbarPetAgenda />
      <AppRoutes />
      <FooterPetAgenda />
    </>
  );
}

export default App;
