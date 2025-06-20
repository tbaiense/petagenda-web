import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../../../contexts/UserContext";

const Modal_Atualizar_Rapido_ServicoRealizado = ({
  servicoRealizado,
  setServicoRealizado,
  show,
  setShow,
}) => {
  const { empresaFetch } = useAuth();
  const handleClose = () => setShow(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [novoServico, setNovoServico] = useState({
    inicio: servicoRealizado.inicio || "",
    fim: servicoRealizado.fim || "",
    funcionario: servicoRealizado.funcionario?.id || "",
  });

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

  async function atualizarServico() {
    const funcionarioSelecionado = funcionarios.find(
      (f) => f.id === parseInt(novoServico.funcionario)
    );
    empresaFetch(`/servico-realizado/${servicoRealizado.id}`, {
      method: "PUT",
      body: JSON.stringify({
        inicio: novoServico.inicio,
        fim: novoServico.fim,
        funcionario: novoServico.funcionario,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setServicoRealizado({
            ...servicoRealizado,
            inicio: novoServico.inicio,
            fim: novoServico.fim,
            funcionario: funcionarioSelecionado,
          });
          alert(data.message);
          handleClose();
        } else {
          alert(data.errors?.join("\n") || "Erro ao atualizar.");
        }
      })
      .catch((error) => {
        console.error("Erro ao atualizar serviço realizado:", error);
        alert("Erro ao atualizar serviço.");
      });
  }

  useEffect(() => {
    if (show) {
      popularFuncionarios();

      setNovoServico({
        inicio: servicoRealizado.inicio || "",
        fim: servicoRealizado.fim || "",
        funcionario: servicoRealizado.funcionario?.id || "",
      });
    }
  }, [show, servicoRealizado]);

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
              value={novoServico.inicio}
              onChange={(e) =>
                setNovoServico({ ...novoServico, inicio: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFimServico">
            <Form.Label>Hora de Finalização:</Form.Label>
            <Form.Control
              type="datetime-local"
              value={novoServico.fim}
              onChange={(e) =>
                setNovoServico({ ...novoServico, fim: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formFuncionario">
            <Form.Label>Funcionário</Form.Label>
            <Form.Select
              value={novoServico.funcionario}
              onChange={(e) =>
                setNovoServico({ ...novoServico, funcionario: e.target.value })
              }
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
