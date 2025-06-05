import React from "react";
import { Container, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Cadastrar_Agendamento.css";
import { ptBR } from "date-fns/locale";

const Agendamento = () => {
  const { register, handleSubmit, reset, control, watch } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <div>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          
          <Form.Group controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome do serviço"
              {...register("nome")}
            />
          </Form.Group>

          <Form.Group controlId="formData">
            <Form.Label>Data do agendamento</Form.Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  locale={ptBR}
                  placeholderText="Selecione a data"
                  onChange={(date) => field.onChange(date)}
                  selected={field.value}
                  className="form-control"
                />
              )}
            />
          </Form.Group>
          <input class="form-control " type="time" step="3600" asp-for="StartTime2" />
        </Form>
      </Container>
    </div>
  );
};

export default Agendamento;
