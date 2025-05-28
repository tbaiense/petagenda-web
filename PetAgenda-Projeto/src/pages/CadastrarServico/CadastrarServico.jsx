import React from "react";
import { useForm } from "react-hook-form";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import "./CadastrarServico.css";

function CadastrarServico() {
  const { register, handleSubmit, reset, watch } = useForm();

    const imagemEmpresa = watch("pathImgFile")
    const imagemURL = imagemEmpresa && imagemEmpresa[0] ? URL.createObjectURL(imagemEmpresa[0]) : null

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  const especies = [
    "Cachorro",
    "Gato",
    "Periquito",
    "Hamster",
    "Coelho",
    "Porquinho-da-Índia",
    "Papagaio",
  ];

  return (
    <div className="cadastrarServico__container mt-4">
      <h2 className="cadastrarServico__title">Cadastrar Serviço</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={5}>
            <Form.Group controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome do serviço"
                {...register("nome")}
              />
            </Form.Group>
          </Col>
          <Col md={2} />
          <Col md={5}>
            <Form.Group controlId="formCategoria">
              <Form.Label>Categoria</Form.Label>
              <Form.Select {...register("categoria")}>
                <option value="">Selecione...</option>
                <option value="banho">Banho</option>
                <option value="tosa">Tosa</option>
                <option value="consulta">Consulta</option>
                <option value="outros">Outros</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={5}>
            <Form.Group controlId="formValor">
              <Form.Label>Valor</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Valor do serviço"
                  {...register("valor")}
                />
                <InputGroup.Text>R$</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={2} />
          <Col md={5}>
            <Form.Group controlId="formTipo">
              <Form.Label>Tipo de cobrança</Form.Label>
              <Form.Select {...register("tipo")}>
                <option value="">Selecione...</option>
                <option value="por__pet">Por cada pet</option>
                <option value="por__servico">Por serviço</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={5} className="oi">
            <Form.Group className="" controlId="formRestricaoParticipantes">
              <Form.Label>Restrição de participantes</Form.Label>
              <Form.Select {...register("restricaoParticipantes")}>
                <option value="">Selecione...</option>
                <option value="individua">Indivídua</option>
                <option value="coletivo">Coletivo</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formDescricaoRestricao" className="mt-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Descreva detalhes sobre o serviço"
                {...register("descricao")}
              />
            </Form.Group>
          </Col>
          <Col md={2} />
          <Col md={5}>
            <Form.Group controlId="formRestricaoEspecies">
              <Form.Label>Restrição de espécies</Form.Label>
              <div className="check_box_especies">
                {especies.map((especie) => (
                  <Form.Check
                    key={especie}
                    type="checkbox"
                    label={especie}
                    value={especie}
                    {...register("restricaoEspecies[]")}
                  />
                ))}
              </div>

            </Form.Group>
          </Col> 
        </Row>


        
        <div>
            <h4>Foto de Perfil</h4>
            {imagemURL && <img src={imagemURL} alt="Pre-Visualização" width={200} height={210}/>}
            <input type="file" {...register("pathImgFile")}/>
        </div>

        {/* Botão de Cadastro */}

        <div className="cadastrarServico__btnWrapper">
          <Button type="submit" variant="primary" className="botao__cadastrar">
            Cadastrar
          </Button>
        </div>
      </Form>
    </div>
  );
}
export default CadastrarServico;
