import styles from "./Relatorio_Simples.module.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/UserContext";
import React, { useState } from "react";
import { Card, Space, DatePicker, Button } from "antd";
import locale from "antd/locale/pt_BR";
const { RangePicker } = DatePicker;
import TabelaRelatorioSimplesFinanceiro from "../../../components/TabelaRelatorioSimplesFinanceiro/TabelaRelatorioSimplesFinanceiro";

const Relatorios = () => {
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {(showRelatorio && (
        <TabelaRelatorioSimplesFinanceiro
          periodo={infoRelatorio.periodo}
          inicio={infoRelatorio.inicio}
          fim={infoRelatorio.fim}
          linhas={infoRelatorio.linhas}
        />
      )) || (
        <Card
          title="Desempenho de serviços oferecidos"
          variant="borderless"
          style={{
            boxShadow: "rgba(0 0 0 / 25%) 0px 0px 10px 1px",
            margin: "6em",
            maxWidth: "fit-content",
          }}
        >
          <Space direction="vertical" size={12}>
            <RangePicker
              locale={locale.DatePicker}
              onChange={(dates, datesStr, info) => {
                setDatas(datesStr);
              }}
            />
            <Button type="primary" onClick={onSubmit}>
              Gerar relatório
            </Button>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default Relatorios;
