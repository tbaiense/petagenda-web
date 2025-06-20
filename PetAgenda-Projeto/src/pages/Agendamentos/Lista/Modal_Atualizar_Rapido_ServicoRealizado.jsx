import React, { useState } from "react";
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

  const [novoServico, setNovoServico] = useState({
    nome: servicoRealizado.servico.nome,
    preco: servicoRealizado.valor.total,
    observacoes: servicoRealizado.observacoes || "",
    foto: servicoRealizado.foto || "",
  });

  async function atualizarServico() {
    empresaFetch(`/servico-realizado/${servicoRealizado.id}`, {
      method: "PUT",
      body: JSON.stringify({
        nome: novoServico.nome,
        preco: novoServico.preco,
        observacoes: novoServico.observacoes,
        foto: novoServico.foto,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setServicoRealizado({
            ...servicoRealizado,
            servico: { ...servicoRealizado.servico, nome: novoServico.nome },
            valor: { ...servicoRealizado.valor, total: novoServico.preco },
            observacoes: novoServico.observacoes,
            foto: novoServico.foto,
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
          <Form.Group className="mb-3" controlId="formNomeServico">
            <Form.Label>Nome do Serviço:</Form.Label>
            <Form.Control
              type="text"
              value={novoServico.nome}
              onChange={(e) =>
                setNovoServico({ ...novoServico, nome: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrecoServico">
            <Form.Label>Preço:</Form.Label>
            <Form.Control
              type="number"
              value={novoServico.preco}
              onChange={(e) =>
                setNovoServico({ ...novoServico, preco: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formObservacoes">
            <Form.Label>Observações:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={novoServico.observacoes}
              onChange={(e) =>
                setNovoServico({
                  ...novoServico,
                  observacoes: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFotoServico">
            <Form.Label>Foto (URL ou nome):</Form.Label>
            <Form.Control
              type="text"
              value={novoServico.foto}
              onChange={(e) =>
                setNovoServico({ ...novoServico, foto: e.target.value })
              }
            />
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
