import React from 'react'
import Stack from 'react-bootstrap/Stack';
import Accordion from 'react-bootstrap/Accordion';
import { Container, Form, Row, Col, Button, Card, FormCheck, useAccordionButton, AccordionButton } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useState } from "react";

const PetServicoCard = ({
    id,
    idPetServico,
    nome,
    especie,
    sexo,
    remedios: remediosProp,
    alimentacao,
    handleRemove
}) => {

    const [ remedios, setRemedios] = useState(remediosProp || []);


    function CustomToggle({ children, eventKey}) {
        const decoratedOnClick = useAccordionButton(eventKey, () => {
            console.log('totally custom!');
            const btn = document.querySelector(`[id='accordion-item-${id}-${nome}']`);

            btn.classList.toggle('collapsed');
            btn.toggleAttribute('expanded')
        });

        return (
            <AccordionButton
                id={`accordion-item-${id}-${nome}`} 
                type="button"
                onClick={decoratedOnClick}
                as="span"
            >
                {children}
            </AccordionButton>
        );
    }

    return (
        <Accordion.Item className='pet-servico-card-item ' eventKey={id} key={id}>
            {/* Título de pet */}
            <Card.Header> 
                <Stack direction="horizontal" gap={3}>
                    <h4 className="me-auto">
                        {nome}
                    </h4>
                    <span style={{ fontSize: '1.0em',border: '1px solid grey', borderRadius: '2em', paddingInline: '1em', paddingBlock: '0.3em'}}>
                        { especie.nome}
                    </span>
                    <Button onClick={ e => {handleRemove(id)}}>✕</Button>
                    <CustomToggle></CustomToggle>
                </Stack>
            </Card.Header>
            <Accordion.Collapse>
                <Card.Body>
                    <Row>
                        <div>
                        <FloatingLabel className="mt-2 mb-4" controlId="floatingTextarea2" label="Instruções de alimentação">
                        <Form.Control
                            as="textarea"
                            value={alimentacao}
                            placeholder="Deixe aqui uma instrução para a alimentação do pet"
                            style={{ height: '70px' }}
                        />
                        </FloatingLabel>
                        </div>
                        <div>
                        <h4>Remédios</h4>
                        <hr></hr>
                        </div>
                        <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome do remédio:</Form.Label>
                            <Form.Control type="text" placeholder="Dipirona monohidratada..." id="nome-remedio"/>
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Instruções de administração:</Form.Label>
                            <Form.Control type="text" placeholder="Administrar duas vezes ao dia..." id="instrucoes-remedio"/>
                        </Form.Group>
                        </Col>
                        <Col>
                        <Button 
                            variant="primary" 
                            type="button" 
                            onClick={ e => {
                                const rem = {
                                    nome: document.getElementById("nome-remedio").value,
                                    instrucoes: document.getElementById("instrucoes-remedio").value,
                                };
                                setRemedios(remedios.concat([ rem ]));
                                remediosProp = remedios;
                            }}
                        >
                            Adicionar
                        </Button>
                        </Col>
                    </Row>
                    {/* Remedios */}
                    {
                        remedios && remedios.map( (r, idx) => {
                        return (
                            <div key={r.id || r.nome + idx } >
                            <Row style={{ borderTop: "1px solid grey"}} className="pt-3 mt-4">
                                <Stack direction="horizontal" gap={3}>
                                <h4 className="me-auto">{ r.nome}</h4>
                                <Button onClick={ e=> {
                                    setRemedios(remedios.flatMap( rem => (rem.id == r.id) ? [] : rem ));
                                }}>✕</Button>
                                </Stack>
                            </Row>
                            <Row>
                                <p>{ r.instrucoes}</p>
                            </Row>
                            </div>
                        );
                        })
                    }
                </Card.Body>
            </Accordion.Collapse>
        </Accordion.Item>
    )
}

export default PetServicoCard