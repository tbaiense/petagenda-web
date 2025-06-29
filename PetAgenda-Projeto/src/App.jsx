import 'bootstrap/dist/css/bootstrap.min.css';
import {Outlet} from "react-router-dom"
import '@ant-design/v5-patch-for-react-19';
import 'antd/dist/reset.css';

function App() {
  return (
    <>
        <Outlet/>
    </>
  );
}

export default App;
