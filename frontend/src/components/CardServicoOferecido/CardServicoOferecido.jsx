
import React from 'react'
import { Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CardServicoOferecido = ({ servicoOferecido }) => {
    // "servicoOferecido": {
    //     "id": 3,
    //     "nome": "Capivara e Gato",
    //     "categoria": 6,
    //     "nomeCategoria": "Creche",
    //     "preco": 231,
    //     "tipoPreco": "pet",
    //     "restricaoParticipante": "coletivo",
    //     "restricaoEspecie": [
    //         {
    //             "especie": 2,
    //             "nomeEspecie": "Gato"
    //         },
    //         {
    //             "especie": 8,
    //             "nomeEspecie": "Capivara"
    //         }
    //     ]
    // }

    const navigate = useNavigate();

  return (
    <>
        <tr>
            <td>{servicoOferecido.nome}</td>
            <td>{servicoOferecido.nomeCategoria}</td>
            <td>{servicoOferecido.restricaoParticipante}</td>
            <td>{
                (() => {
                    const restEsp = servicoOferecido.restricaoEspecie;

                    if (!restEsp || restEsp.length == 0) {
                        return "Todas";
                    }

                    if (restEsp.length == 1) {
                        return restEsp[0].nomeEspecie;
                    }

                    return "Restrito";
                })()    
            }</td>
            <td>{servicoOferecido.tipoPreco}</td>
            <td>{`R$ ${servicoOferecido.preco}`}</td>
            {/* <td>
                <Button className="form-button" variant="primary" onClick={ (e) => {navigate(`/empresa/servicos/${servicoOferecido.id}/editar`)}}>Editar</Button>
            </td> */}
            <td>
            <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Cadastrar
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => {navigate('/empresa/agendamentos/cadastrar', { state: { servicoSelecionado: servicoOferecido.id }})}}>Agendamento</Dropdown.Item>
                        <Dropdown.Item onClick={ e => {navigate('/empresa/servicos/realizados/cadastrar')}}>Serviço Executado</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </td>
        </tr>
    </>
    );
}

export default CardServicoOferecido
