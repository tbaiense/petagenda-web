import "./EditarEmpresa.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import NavEmpresa from "../../../components/navegacaoEmpresa/NavEmpresa.jsx";

const EditarEmpresa = () => {
  const { setEmpresa, empresaFetch, getToken, licenca, setLicenca } = useAuth();
  const {state} = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm();

  const imagemEmpresa = watch("pathImgFile");
  const imagemURL =
    imagemEmpresa && imagemEmpresa[0]
      ? URL.createObjectURL(imagemEmpresa[0])
      : null;

  const onSubmit = async (data) => {
    console.log(typeof data);
    const fileFoto = data.pathImgFile.item(0);
    // const byteString = await fileFoto.bytes();
    // const base64 = byteString.toBase64();

    const objEmp = {
      nomeFantasia: data.NomeFantasia,
      razaoSocial: data.RazaoSocial,
      cnpj: data.CNPJ,
      lema: data.Lema,
      // foto: {
      //     type: fileFoto.type,
      //     data: base64
      // }
    };

    const res = await empresaFetch("", {
      method: "PUT",
      body: JSON.stringify(objEmp),
    });

    const jsonBody = await res.json();

    if (res.status == 200) {
      setEmpresa(jsonBody.empresa);
      setLicenca(licenca);
      alert("Empresa atualizada com sucesso!");
      navigate("/empresa/informacoes");
    } else {
      alert("Erro ao atualizar empresa");
    }
  };

  const onError = (errors) => {
    console.log("Erro ao Enviar:", errors);
  };

  return (
    <div>
      <NavEmpresa />
      <div className="container my-5">
        <h2 className="text-center mb-4">Editar da Empresa</h2>

        <div className="row">
          <div className="col-md-8">
            <form onSubmit={handleSubmit(onSubmit, onError)} className="p-4">
              <div className="mb-3">
                <label className="form-label">Nome Fantasia</label>
                <input
                  type="text"
                  defaultValue={state.nomeFantasia}
                  className={`form-control ${
                    errors.NomeFantasia ? "is-invalid" : ""
                  }`}
                  {...register("NomeFantasia", {
                    required: "O nome fantasia é obrigatório",
                    minLength: {
                      value: 10,
                      message: "Deve ter pelo menos 10 caracteres",
                    },
                    maxLength: {
                      value: 80,
                      message: "Deve ter no máximo 80 caracteres",
                    },
                  })}
                />
                {errors.NomeFantasia && (
                  <div className="invalid-feedback">
                    {errors.NomeFantasia.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Razão Social</label>
                <input
                  type="text"
                  defaultValue={state.razaoSocial}
                  className={`form-control ${
                    errors.RazaoSocial ? "is-invalid" : ""
                  }`}
                  {...register("RazaoSocial", {
                    required: "A razão social é obrigatória",
                    minLength: {
                      value: 10,
                      message: "Deve ter pelo menos 10 caracteres",
                    },
                    maxLength: {
                      value: 80,
                      message: "Deve ter no máximo 80 caracteres",
                    },
                  })}
                />
                {errors.RazaoSocial && (
                  <div className="invalid-feedback">
                    {errors.RazaoSocial.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">CNPJ</label>
                <input
                  type="text"
                  disabled={true}
                  className={`form-control ${errors.CNPJ ? "is-invalid" : ""}`}
                  defaultValue={state.cnpj}
                  {...register("CNPJ", {
                    required: "O CNPJ é obrigatório",
                    pattern: {
                      value: /^[0-9]{14}$/,
                      message: "O CNPJ deve conter exatamente 14 números",
                    },
                  })}
                />
                {errors.CNPJ && (
                  <div className="invalid-feedback">{errors.CNPJ.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Lema</label>
                <textarea
                  className={`form-control ${errors.Lema ? "is-invalid" : ""}`}
                  rows={3}
                  defaultValue={state.lema}
                  placeholder="Nosso lema é..."
                  {...register("Lema", {
                    minLength: {
                      value: 10,
                      message: "O lema deve ter pelo menos 10 caracteres",
                    },
                    maxLength: {
                      value: 150,
                      message: "O lema deve ter no máximo 150 caracteres",
                    },
                  })}
                />
                {errors.Lema && (
                  <div className="invalid-feedback">{errors.Lema.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Imagem de Perfil</label>
                <input
                  type="file"
                  defaultValue={state.foto}
                  className="form-control"
                  {...register("pathImgFile")}
                />
              </div>

              <div className="d-flex justify-content-center mt-4 gap-3">
                <button type="submit" className="btn btn-success">
                  Finalizar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    reset();
                    setImagemURL(null);
                  }}
                >
                  Limpar
                </button>
              </div>
            </form>
          </div>

          <div className="col-md-4 d-flex flex-column align-items-center justify-content-start mt-4 mt-md-0">
            {imagemURL && (
              <img
                src={imagemURL}
                alt="Pré-visualização"
                className="img-thumbnail mb-3"
                width={200}
                height={210}
              />
            )}
            <h5>Foto de Perfil</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarEmpresa;
