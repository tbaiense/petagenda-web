import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import editar from "../../assets/icon_editar.svg";
import { useNavigate } from "react-router-dom";


const CardServicoRealizado = ({ servicoRealizado, handleEditar }) => {
  const navigate = useNavigate();

  const editarServico = (id) => {
    console.log("Esse é o ID escolhido:",servicoRealizado?.id)
    navigate(`/empresa/agendamentos/editar/servicoexecutado`, {state : {id}});
  };

  return (
    <>
    {/*  */}
      <tr>
        <td><img src={editar} onClick={() => editarServico(servicoRealizado?.id)} alt=""/>{servicoRealizado.id}</td>
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
