import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../../../contexts/UserContext";

const Modal_Atualizar_Rapido_ServicoRealizado = ({
  servicoRealizado,
  show,
  setShow,
  handleRefresh
}) => {

  const { empresaFetch } = useAuth();
  const handleClose = () => setShow(false);
  const [ funcionarios, setFuncionarios] = useState([]);
  const [ novoInicio, setNovoInicio ] = useState("");
  const [ novoFim, setNovoFim ] = useState("");
  const [ novoFuncionario, setNovoFuncionario ] = useState({});

  
  async function popularFuncionarios() {
    empresaFetch("/funcionario")
    .then((res) => res.json())
    .then((data) => {
      setFuncionarios(data.funcionarios);
    })
    .catch((error) => {
      console.error("Erro ao buscar Funcionarios:", error);
    });
  }

  useEffect(() => {
    popularFuncionarios();
    setNovoInicio(servicoRealizado.inicio);
    setNovoFim(servicoRealizado.fim);
    setNovoFuncionario(servicoRealizado.funcionario);
  }, []);
  
  async function atualizarServico() {
    const novoServ = {
      inicio: novoInicio,
      fim: novoFim,
      funcionario: novoFuncionario,
    };
    console.log(novoServ);

    empresaFetch(`/servico-realizado/${servicoRealizado.id}`, {
      method: "PUT",
      body: JSON.stringify(novoServ),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
          handleClose();
          handleRefresh();
        } else {
          alert(data.errors?.join("\n") || "Erro ao atualizar.");
        }
      })
      .catch((error) => {
        console.error("Erro ao atualizar serviço realizado:", error);
        alert("Erro ao atualizar serviço.");
      });
  }

  function handleSave() {
    atualizarServico();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Atualizar Serviço Realizado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formInicioServico">
            <Form.Label>Hora de Início:</Form.Label>
            <Form.Control
              type="datetime-local"
              defaultValue={novoInicio}
              onInput={(e) => setNovoInicio(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFimServico">
            <Form.Label>Hora de Finalização:</Form.Label>
            <Form.Control
              type="datetime-local"
              defaultValue={novoFim}
              onInput={(e) => setNovoFim(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formFuncionario">
            <Form.Label>Funcionário</Form.Label>
            <Form.Select
              value={novoFuncionario?.id || ""}
              onInput={(e) => setNovoFuncionario(funcionarios.find( f => f.id == e.target.value )) ?? ""}
            >
              <option value="">Selecione um funcionário</option>
              {funcionarios &&
                funcionarios.map((funcionario) => (
                  <option key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Modal_Atualizar_Rapido_ServicoRealizado;
