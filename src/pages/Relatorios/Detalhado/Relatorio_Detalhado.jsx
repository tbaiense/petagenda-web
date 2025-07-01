import React, { useState } from "react";
import { Card, Col, Row } from "antd";
import { DatePicker, Space } from "antd";
import locale from "antd/locale/pt_BR";
import { Button, Flex } from "antd";
import { useAuth } from "../../../contexts/UserContext";
import TabelaRelatorioDetalhadoServicoOferecido from "../../../components/TabelaRelatorioDetalhadoServicoOferecido/TabelaRelatorioDetalhadoServicoOferecido";
const { RangePicker } = DatePicker;
import { Alert } from "antd";
function Relatorio_Detalhado() {
  const [mensagemAlerta, setMensagemAlerta] = useState(null);
  const { empresaFetch } = useAuth();
  const [showRelatorio, setShowRelatorio] = useState(false);
  const [infoRelatorio, setInfoRelatorio] = useState({});
  const [datas, setDatas] = useState([]);

  async function gerarRelatorioDetalhadoServicoOferecido(inicio, fim) {
    const resp = await empresaFetch(
      `/relatorio/detalhado/servico-oferecido?inicio=${inicio}&fim=${fim}`
    );

    if (resp.status != 200) {
      return [];
    }

    const { result } = await resp.json();

    return result; // [] contendo linhas da tabela
  }

  const onSubmit = async (e) => {
    const [inicio, fim] = datas;
    const result = await gerarRelatorioDetalhadoServicoOferecido(inicio, fim);
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
      inicio: inicio,
      fim: fim,
      linhas: result,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
        <TabelaRelatorioDetalhadoServicoOferecido
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
}

export default Relatorio_Detalhado;
