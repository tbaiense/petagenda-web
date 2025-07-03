import { NavLink, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';

const Mybreadcrumb = () => {
  const location = useLocation();

  const pathSnippets = location.pathname.split('/').filter(i => i);

  const caminhoAtual = location.pathname

  return (
    <Breadcrumb style={{ position:"relative" }}>
      <Breadcrumb.Item>Início</Breadcrumb.Item>
      {pathSnippets.map((snippet, index) => (
        <Breadcrumb.Item key={index}>
          {decodeURIComponent(snippet)}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

export default Mybreadcrumb