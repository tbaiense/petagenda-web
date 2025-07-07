import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/UserContext";
import { Row, Col } from "react-bootstrap";
import styles from "./Editar_Pets.module.css";
const EditarPet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { empresaFetch } = useAuth();

  const [aceito, setAceito] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function carregarPet() {
      try {
        const res = await empresaFetch(`/pet/${id}`);
        const json = await res.json();

        if (res.status !== 200 || !json.pet) {
          throw new Error("Erro ao buscar pet");
        }

        const pet = json.pet;

        reset({
          nome: pet.nome,
          comportamento: pet.comportamento,
          estadoSaude: pet.estadoSaude,
          porte: pet.porte,
          eCastrado: pet.eCastrado,
        });

        setAceito(pet.eCastrado);
      } catch (err) {
        alert("Erro ao carregar dados do pet: " + err.message);
      }
    }

    carregarPet();
  }, [id, empresaFetch, reset]);

  const onSubmit = async (data) => {
    const petAtualizado = {
      nome: data.nome,
      comportamento: data.comportamento,
      estadoSaude: data.estadoSaude,
      porte: data.porte,
      eCastrado: data.eCastrado || false,
    };

    try {
      const res = await empresaFetch(`/pet/${id}`, {
        method: "PUT",
        body: JSON.stringify(petAtualizado),
      });

      if (res.status === 200) {
        alert("Pet atualizado com sucesso!");
        navigate("/empresa/pets/lista");
      } else {
        alert("Erro ao atualizar pet.");
      }
    } catch (err) {
      alert("Erro: " + err.message);
    }
  };

  return (
    <>
      <div className={styles.layoutLista}>
        <h1 className="text-center pt-3">Editar Pet</h1>
        <hr />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ maxWidth: "600px" }}
        className="mx-auto d-flex flex-column gap-3"
      >
        <Row className="mt-2 g-3">
          <Col md={6} className="">
            <label htmlFor="nome" className="form-label">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              className={`form-control ${errors.nome ? "is-invalid" : ""}`}
              {...register("nome", { required: true })}
            />
            {errors.nome && (
              <div className="invalid-feedback">Nome é obrigatório</div>
            )}
          </Col>
          <Col md={1} className=""></Col>
          <Col md={5} className="">
            <label htmlFor="porte" className="form-label">
              Porte
            </label>
            <select
              id="porte"
              className={`form-select ${errors.porte ? "is-invalid" : ""}`}
              {...register("porte", { required: true })}
            >
              <option value="">Selecione</option>
              <option value="P">Pequeno</option>
              <option value="M">Médio</option>
              <option value="G">Grande</option>
            </select>
            {errors.porte && (
              <div className="invalid-feedback">Porte é obrigatório</div>
            )}
          </Col>
        </Row>

        <fieldset className="form-check">
          <input
            id="eCastrado"
            className="form-check-input"
            type="checkbox"
            {...register("eCastrado")}
          />
          <label className="form-check-label" htmlFor="eCastrado">
            Castrado?
          </label>
        </fieldset>

        <section>
          <label htmlFor="estadoSaude" className="form-label">
            Estado de Saúde
          </label>
          <textarea
            id="estadoSaude"
            className={`form-control ${errors.estadoSaude ? "is-invalid" : ""}`}
            rows={3}
            {...register("estadoSaude", { required: true })}
          />
          {errors.estadoSaude && (
            <div className="invalid-feedback">Informe o estado de saúde</div>
          )}
        </section>

        <section>
          <label htmlFor="comportamento" className="form-label">
            Comportamento
          </label>
          <textarea
            id="comportamento"
            className="form-control"
            rows={3}
            {...register("comportamento")}
          />
        </section>

        <section className="d-flex justify-content-center pb-3">
          <button type="submit" className="btn btn-success px-4 rounded-pill">
            Salvar Alterações
          </button>
        </section>
      </form>
    </>
  );
};

export default EditarPet;
