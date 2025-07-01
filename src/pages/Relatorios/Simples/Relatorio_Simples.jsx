import styles from "./Relatorio_Simples.module.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/UserContext";
import React, { useState } from "react";
import { Alert } from "antd";
import TabelaRelatorioSimplesFinanceiro from "../../../components/TabelaRelatorioSimplesFinanceiro/TabelaRelatorioSimplesFinanceiro";

const Relatorios = () => {
  const [mensagemAlerta, setMensagemAlerta] = useState(null);
  const [showRelatorio, setShowRelatorio] = useState(false);
  const [infoRelatorio, setInfoRelatorio] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
  } = useForm();

  const navigate = useNavigate();

  const { empresaFetch } = useAuth();

  async function gerarRelatorioSimplesFinanceiro(periodo, inicio, fim) {
    const resp = await empresaFetch(
      `/relatorio/simples/financeiro?periodo=${periodo}&inicio=${inicio}&fim=${fim}`
    );

    if (resp.status != 200) {
      return [];
    }

    const { result } = await resp.json();

    return result; // [] contendo linhas da tabela
  }

  const onSubmit = async (data) => {
    const periodo = getValues("periodo");
    const inicio = getValues("inicio");
    const fim = getValues("fim");

    const result = await gerarRelatorioSimplesFinanceiro(periodo, inicio, fim);
    setMensagemAlerta({
      titulo: "Relatório gerado com sucesso!",
      descricao: `Serviços oferecidos entre ${inicio} e ${fim}`,
      tipo: "success",
    });

    setTimeout(() => {
      setMensagemAlerta(null);
    }, 2500);

    await new Promise((resolve) => setTimeout(resolve, 2500));
    setShowRelatorio(true);
    console.log("result: ", result);
    setInfoRelatorio({
      periodo: periodo,
      inicio: inicio,
      fim: fim,
      linhas: result,
    });
  };

  const onErrors = (errors) => {
    console.log("Erro:", errors);
  };

  return (
    <div className={styles.backgroudFormulario}>
      {mensagemAlerta && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: "fit-content",
            maxWidth: "90vw",
          }}
        >
          <Alert
            message={mensagemAlerta.titulo}
            description={mensagemAlerta.descricao}
            type={mensagemAlerta.tipo}
            showIcon
            style={{
              fontSize: "12px",
              padding: "8px 12px",
              lineHeight: "1.2",
            }}
          />
        </div>
      )}

      {(showRelatorio && (
        <TabelaRelatorioSimplesFinanceiro
          periodo={infoRelatorio.periodo}
          inicio={infoRelatorio.inicio}
          fim={infoRelatorio.fim}
          linhas={infoRelatorio.linhas}
        />
      )) || (
        <form
          className={styles.estiloFormulario}
          onSubmit={handleSubmit(onSubmit, onErrors)}
        >
          <h2>Financeiro</h2>

          <div className={styles.espacamento}>
            <div className={styles.estiloCampos}>
              <label htmlFor="">Perído:</label>
              <select {...register("periodo", { required: true })}>
                <option value="mensal">Mensal</option>
                {/* <option value="">Trimestral</option> */}
                <option value="anual">Anual</option>
              </select>
            </div>

            <div className={styles.estiloCampos}>
              <label>Incluir Despesas:</label>
              <input
                type="checkbox"
                {...register("incluirDespesas", { required: false })}
              />
            </div>

            <div className={styles.estiloCampos}>
              <label>Início:</label>
              <input type="date" {...register("inicio", { required: true })} />
            </div>

            <div className={styles.estiloCampos}>
              <label>Fim:</label>
              <input type="date" {...register("fim", { required: true })} />
            </div>
          </div>

          <div className={styles.bttn}>
            <button type="submit">Gerar Relatório</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Relatorios;
