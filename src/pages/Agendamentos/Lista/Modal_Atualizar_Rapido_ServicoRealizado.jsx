import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../../../contexts/UserContext";

const Modal_Atualizar_Rapido_ServicoRealizado = ({
  servicoRealizado,
  show,
  setShow,
  handleRefresh,
  setMensagemAlerta,
}) => {
  const { empresaFetch } = useAuth();
  const [formTocado, setFormTocado] = useState(false);
  const handleClose = () => setShow(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [novoInicio, setNovoInicio] = useState("");
  const [novoFim, setNovoFim] = useState("");
  const [novoFuncionario, setNovoFuncionario] = useState({});

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
          setMensagemAlerta({
            tipo: "success",
            titulo: "Sucesso",
            descricao: "Serviço realizado atualizado com sucesso.",
          });
          setTimeout(() => setMensagemAlerta(null), 2500);
          handleClose();
          handleRefresh();
        } else {
          setMensagemAlerta({
            tipo: "info",
            titulo: "Prencha todos os campos",
            descricao: "Por favor, preencha todos os campos obrigatórios.",
          });
          setTimeout(() => setMensagemAlerta(null), 2500);
        }
      })
      .catch((error) => {
        console.error("Erro ao atualizar serviço realizado:", error);
        setMensagemAlerta({
          tipo: "error",
          titulo: "Erro inesperado",
          descricao:
            "Não foi possível atualizar o serviço. Tente novamente mais tarde.",
        });
        setTimeout(() => setMensagemAlerta(null), 2500);
      });
  }

  function handleSave() {
    setFormTocado(true);
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
              onChange={(e) => setNovoInicio(e.target.value)}
              isInvalid={formTocado && !novoInicio}
              required
            />
            <Form.Control.Feedback type="invalid">
              Por favor, preencha a hora de início.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFimServico">
            <Form.Label>Hora de Finalização:</Form.Label>
            <Form.Control
              type="datetime-local"
              defaultValue={novoFim}
              onChange={(e) => setNovoFim(e.target.value)}
              isInvalid={formTocado && !novoFim}
              required
            />
          </Form.Group>
          <Form.Control.Feedback type="invalid">
            Por favor, preencha a hora de finalização.
          </Form.Control.Feedback>

          <Form.Group controlId="formFuncionario">
            <Form.Label>Funcionário</Form.Label>
            <Form.Select
              value={novoFuncionario?.id || ""}
              onInput={(e) =>
                setNovoFuncionario(
                  funcionarios.find((f) => f.id == e.target.value)
                ) ?? ""
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
