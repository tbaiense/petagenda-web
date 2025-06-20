import React, { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Modal_Atualizar_Rapido_Agendamento = ({
  agendamento,
  show,
  setShow,
  estado,
  setEstado,
  funcionario,
  setFuncionario,
  funcDisponiveis,
}) => {
  const [novoEstado, setNovoEstado] = useState({});
  const [novoFuncionario, setNovoFuncionario] = useState({});
  const { empresaFetch } = useAuth();
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function atualizarFuncionario() {
    empresaFetch(`/agendamento/${agendamento.id}/funcionario`, {
      method: "PUT",
      body: JSON.stringify(novoFuncionario),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFuncionario(novoFuncionario);
          setEstado({ id: "preparado" });

          alert(data.message);
          handleClose();
        } else {
          alert(data.errors.join("\n"));
        }
      })
      .catch((error) => {
        console.error("Erro ao atualizar funcionário atribuído:", error);
      });
  }

  async function atualizarEstado() {
    empresaFetch(`/agendamento/${agendamento.id}/estado`, {
      method: "PUT",
      body: JSON.stringify(novoEstado),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEstado(novoEstado);
          alert(data.message);
          handleClose();
        } else {
          alert(data.errors.join("\n"));
        }
      })
      .catch((error) => {
        console.error("Erro ao atualizar estado:", error);
      });
  }

  function handleSave() {
    console.log("novoFunc: ", novoFuncionario);
    console.log("novoEstado: ", novoEstado);
    if (novoFuncionario.id && novoFuncionario.id != funcionario.id)
      atualizarFuncionario();
    if (novoEstado.id && novoEstado.id != estado.id) atualizarEstado();
  }

  // useEffect(() => { console.log(estado) }, [estado]);
  // useEffect(() => { console.log(funcionario) }, [funcionario]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Atualizar Agendamento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Funcionário atribuído:</Form.Label>
            <Form.Select
              disabled={[
                "pendente",
                "preparado",
                "concluido",
                "cancelado",
              ].includes(estado.id)}
              onInput={(e) => {
                if (e.target.value)
                  setNovoFuncionario(
                    funcDisponiveis.find((f) => f.id == e.target.value)
                  );
              }}
              defaultValue={funcionario.id}
              className="form-button"
              aria-label="Default select example"
            >
              {!funcionario.id ? <option>Atribuir funcionário</option> : <></>}
              {funcDisponiveis &&
                funcDisponiveis.map((f) => {
                  return (
                    <option value={f.id} key={f.id}>
                      {f.nome}
                    </option>
                  );
                })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Estado:</Form.Label>
            <Form.Select
              disabled={!funcionario.nome}
              onInput={(e) => {
                if (e.target.value) setNovoEstado({ id: e.target.value });
              }}
              defaultValue={estado.id}
              className="form-button"
              aria-label="Default select example"
            >
              <option
                value="criado"
                hidden={[
                  "pendente",
                  "preparado",
                  "concluido",
                  "cancelado",
                ].includes(estado.id)}
              >
                Criado
              </option>
              <option
                value="preparado"
                hidden={["pendente", "concluido", "cancelado"].includes(
                  estado.id
                )}
              >
                Preparado
              </option>
              <option
                value="pendente"
                hidden={["concluido", "cancelado"].includes(estado.id)}
              >
                Pendente
              </option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
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

export default Modal_Atualizar_Rapido_Agendamento;
