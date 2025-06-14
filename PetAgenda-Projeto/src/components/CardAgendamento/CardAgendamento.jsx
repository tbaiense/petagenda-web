
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import Modal_Atualizar_Rapido_Agendamento from '../../pages/Agendamentos/Lista/Modal_Atualizar_Rapido_Agendamento';

const CardAgendamento = ({ agendamento, funcDisponiveis }) => {
    const [ estado, setEstado ] = useState({});
    const [ funcionario, setFuncionario ] = useState({});

    const [show, setShow] = useState(false);
    
    const handleShowEditarModal = () => {
        setShow(true);
    }

    // useEffect(() => {
    //     console.log('rodei func');
    //     if (agendamento.funcionario?.nome) 
    //     setEstado(agendamento.funcionario);
    // }, [agendamento.funcionario.id]);

    // useEffect(() => {
    //     console.log('rodei est');
    //     setEstado(agendamento.estado);
    // }, [agendamento.estado.id]);

    useEffect(() => {
        setEstado(agendamento.estado);
        if (agendamento.funcionario?.nome) setFuncionario(agendamento.funcionario);
    }, []);

  return (
    <>
        <tr>
            <td>{agendamento.servico.nome}</td>
            <td>TODO: Nome do cliente</td>
            <td>{funcionario.nome}</td>
            <td><div>{agendamento.dtHrMarcada.replace(/ \d\d:\d\d:\d\d/, '')}</div><br></br>~2 meses</td>
            <td>{agendamento.dtHrMarcada.replace(/\d{4}-\d{2}-\d{2} /, '')}</td>
            <td>{estado.id}</td>
            <td>{`R$ ${agendamento.valor.total}`}</td>
            <td>
                <Button className="form-button" variant="primary" onClick={handleShowEditarModal}>Editar</Button>
                <Button className="form-button" variant="success">Detalhes</Button>
            </td>
        </tr>
        <Modal_Atualizar_Rapido_Agendamento
            funcDisponiveis={funcDisponiveis} 
            agendamento={agendamento} 
            estado={estado} 
            setEstado={setEstado} 
            funcionario={funcionario} 
            setFuncionario={setFuncionario} 
            show={show} 
            setShow={setShow}>
        </Modal_Atualizar_Rapido_Agendamento>
    </>
    );
}

export default CardAgendamento
