import React from "react";
import { useForm } from "react-hook-form";
import { Button, Form, InputGroup } from "react-bootstrap";
import "./CadastrarServico.css";

function CadastrarServico() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <div className="cadastrarServico__container">
      <h2 className="cadastrarServico__title">Cadastrar Serviço</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="linha__nome__categoria">
          <Form.Group className="nome" controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome do serviço"
              {...register("nome")}
            />
          </Form.Group>

          <Form.Group className="categoria" controlId="formCategoria">
            <Form.Label>Categoria</Form.Label>
            <Form.Select {...register("categoria")}>
              <option value="">Selecione...</option>
              <option value="banho">Banho</option>
              <option value="tosa">Tosa</option>
              <option value="consulta">Consulta</option>
              <option value="outros">Outros</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="linha__valor__cobranca">
          <Form.Group
            className="valor"
            controlId="formValor"
          >
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

          <Form.Group className="tipo__cobranca" controlId="formTipo">
            <Form.Label>Tipo de cobrança</Form.Label>
            <Form.Select {...register("tipo")}>
              <option value="">Selecione...</option>
              <option value="por__pet">Por cada pet</option>
              <option value="por__servico">Por serviço</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="linha__nome__categoria">
          <Form.Group className="nome" controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome do serviço"
              {...register("nome")}
            />
          </Form.Group>

          <Form.Group className="categoria" controlId="formCategoria">
            <Form.Label>Categoria</Form.Label>
            <Form.Select {...register("categoria")}>
              <option value="">Selecione...</option>
              <option value="banho">Banho</option>
              <option value="tosa">Tosa</option>
              <option value="consulta">Consulta</option>
              <option value="outros">Outros</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="cadastrarServico__btnWrapper">
          <Button type="submit" variant="primary">
            Cadastrar
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CadastrarServico;
