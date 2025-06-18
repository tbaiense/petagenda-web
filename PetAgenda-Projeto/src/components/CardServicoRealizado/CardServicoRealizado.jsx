
import { Button } from 'react-bootstrap';

const CardServicoRealizado = ({ servicoRealizado }) => {
  return (
    <>
        <tr>
            <td>{servicoRealizado.servico.nome}</td>
            <td>{servicoRealizado.cliente.nome}</td>
            <td>{funcionario.nome}</td>
            <td><div>{servicoRealizado.inicio.replace(/ \d\d:\d\d:\d\d/, '')}</div><br></br>~2 meses</td>
            <td>{servicoRealizado.inicio.replace(/\d{4}-\d{2}-\d{2} /, '')}</td>
            <td>{servicoRealizado.fim.replace(/\d{4}-\d{2}-\d{2} /, '')}</td>
            <td>{`R$ ${servicoRealizado.valor.total}`}</td>
            <td>
                <Button className="form-button" variant="primary" onClick={() => { console.log('atualizar'); }}>Atualizar</Button>
                <Button className="form-button" variant="success">Visualizar</Button>
            </td>
        </tr>
    </>
    );
}

export default CardServicoRealizado;
