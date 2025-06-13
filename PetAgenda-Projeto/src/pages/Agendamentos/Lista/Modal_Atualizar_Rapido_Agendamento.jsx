import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const Modal_Atualizar_Rapido_Agendamento = ({show, setShow}) => {

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    console.log(show.show);
    return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Atualizar Agendamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Funcionário atribuído:</Form.Label>
            <Form.Select className="form-button" aria-label="Default select example">
                <option>Filtrar por</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </Form.Select>
            </Form.Group>
            <Form.Group
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
            >
            <Form.Label>Estado::</Form.Label>
            <Form.Select className="form-button" aria-label="Default select example">
                <option>Filtrar por</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </Form.Select>              
            </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Cancelar
        </Button>
        <Button variant="primary" onClick={handleClose}>
            Salvar
        </Button>
        </Modal.Footer>
    </Modal>
    );
}

export default Modal_Atualizar_Rapido_Agendamento