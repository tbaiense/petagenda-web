import { Button } from "react-bootstrap";
import { useState } from "react";

const CardServicoRealizado = ({ 
  servicoRealizado, handleEditar
}) => {

  return (
    <>
      <tr>
        <td>{servicoRealizado.servico.nome}</td>
        <td>{servicoRealizado.cliente.nome}</td>
        <td>{servicoRealizado.funcionario.nome}</td>
        <td>
          <div>
            {servicoRealizado.inicio &&
              servicoRealizado.inicio.replace(/ \d\d:\d\d:\d\d/, "")}
          </div>
          <br />
          ~2 meses
        </td>
        <td>
          {servicoRealizado.inicio &&
            servicoRealizado.inicio.replace(/\d{4}-\d{2}-\d{2} /, "")}
        </td>
        <td>
          {servicoRealizado.fim &&
            servicoRealizado.fim.replace(/\d{4}-\d{2}-\d{2} /, "")}
        </td>
        <td>{`R$ ${servicoRealizado.valor.total}`}</td>
        <td>
          <Button 
            className="form-button" 
            variant="primary" 
            onClick={(e) => handleEditar(servicoRealizado)}
          >
            Atualizar
          </Button>
          <Button className="form-button" variant="success">
            Visualizar
          </Button>
        </td>
      </tr>
    </>
  );
};

export default CardServicoRealizado;
