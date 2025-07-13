import React from 'react'
import Stack from 'react-bootstrap/Stack';
import Accordion from 'react-bootstrap/Accordion';
import { Container, Form, Row, Col, Button, Card, FormCheck, useAccordionButton, AccordionButton } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useState } from "react";

const PetServicoCard = ({...props}) => {
    console.log("props pet: ", props.pet);

    function CustomToggle({ children, eventKey}) {
        const decoratedOnClick = useAccordionButton(eventKey, () => {
            const btn = document.querySelector(`[id='accordion-item-${props.pet.id}-${props.pet.nome}']`);

            btn.classList.toggle('collapsed');
            btn.toggleAttribute('expanded')
        });

        return (
            <AccordionButton
                id={`accordion-item-${props.pet.id}-${props.pet.nome}`} 
                type="button"
                onClick={decoratedOnClick}
                as="span"
            >
                {children}
            </AccordionButton>
        );
    }

    return (
        <Accordion.Item className='pet-servico-card-item ' eventKey={props.pet.id} key={props.pet.id}>
            {/* Título de pet */}
            <Card.Header> 
                <Stack direction="horizontal" gap={3}>
                    <h4 className="me-auto">
                        {props.pet.nome}
                    </h4>
                    <span style={{ fontSize: '1.0em',border: '1px solid grey', borderRadius: '2em', paddingInline: '1em', paddingBlock: '0.3em'}}>
                        { props.pet.especie.nome}
                    </span>
                    {
                        props.allowEdit && 
                        <Button onClick={ e => {
                            props.setPetList(props.petList.filter( p => p.id != props.pet.id ));
                        }}>✕</Button>
                    }
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
                            value={props.pet.alimentacao}
                            placeholder="Deixe aqui uma instrução para a alimentação do pet"
                            style={{ height: '70px' }}
                            disabled={!props.allowEdit}
                            onChange={ e=> {
                                props.pet.alimentacao = e.target.value;
                                props.setPetList( props.petList.map( p => {
                                    if (p.id == props.pet.id) {
                                        return props.pet;
                                    } else {
                                        return p;
                                    }
                                }));
                            }}
                        />
                        </FloatingLabel>
                        </div>
                        <div>
                        <h4>Remédios</h4>
                        <hr hidden={!props.allowEdit}></hr>
                        </div>
                        <Col>
                        <Form.Group className="mb-3" hidden={!props.allowEdit}>
                            <Form.Label>Nome do remédio:</Form.Label>
                            <Form.Control disabled={!props.allowEdit} type="text" placeholder="Dipirona monohidratada..." id="nome-remedio"/>
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group className="mb-3" hidden={!props.allowEdit}>
                            <Form.Label>Instruções de administração:</Form.Label>
                            <Form.Control 
                            disabled={!props.allowEdit}
                            type="text" placeholder="Administrar duas vezes ao dia..." id="instrucoes-remedio"/>
                        </Form.Group>
                        </Col>
                        <Col>
                        <Button 
                            variant="primary" 
                            type="button" 
                            hidden={!props.allowEdit}
                            onClick={ e => {
                                const rem = {
                                    nome: document.getElementById("nome-remedio").value,
                                    instrucoes: document.getElementById("instrucoes-remedio").value,
                                };

                                if (!props.pet.remedios) {
                                    props.pet.remedios = [];
                                }

                                props.pet.remedios = props.pet.remedios.concat([ rem ]);
                                props.setPetList( props.petList.map( p => {
                                    if (p.id == props.pet.id) {
                                        return props.pet;
                                    } else {
                                        return p;
                                    }
                                }));
                            }}
                        >
                            Adicionar
                        </Button>
                        </Col>
                    </Row>
                    {/* Remedios */}
                    {
                        props.pet.remedios && props.pet.remedios.map( (r, idx) => {
                        return (
                            <div key={r.id || r.nome + idx } >
                            <Row style={{ borderTop: "1px solid grey"}} className="pt-3 mt-4">
                                <Stack direction="horizontal" gap={3}>
                                <h4 className="me-auto">{ r.nome}</h4>
                                <Button 
                                hidden={!props.allowEdit}
                                onClick={ e=> {
                                    if (props.pet.remedios.length != 0) {
                                        props.pet.remedios = props.pet.remedios.flatMap( rem => (rem.id == r.id) ? [] : rem );
                                        
                                        props.setPetList( props.petList.map( p => {
                                            if (p.id == props.pet.id) {
                                                return props.pet;
                                            } else {
                                                return p;
                                            }
                                        }));
                                    }
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