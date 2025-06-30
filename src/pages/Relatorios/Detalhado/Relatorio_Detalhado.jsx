import React, { useState } from 'react'
import { Card, Col, Row } from 'antd';
import { DatePicker, Space } from 'antd';
import locale from 'antd/locale/pt_BR';
import { Button, Flex } from 'antd';
import { useAuth } from '../../../contexts/UserContext';
import TabelaRelatorioDetalhadoServicoOferecido from '../../../components/TabelaRelatorioDetalhadoServicoOferecido/TabelaRelatorioDetalhadoServicoOferecido';
const { RangePicker } = DatePicker;

function Relatorio_Detalhado() {
  const { empresaFetch } = useAuth();
  const [ showRelatorio, setShowRelatorio ] = useState(false);
  const [ infoRelatorio, setInfoRelatorio ] = useState({});
  const [ datas, setDatas ] = useState([]);

  async function gerarRelatorioDetalhadoServicoOferecido(inicio, fim) {
    const resp = await empresaFetch(`/relatorio/detalhado/servico-oferecido?inicio=${inicio}&fim=${fim}`);

    if (resp.status != 200) {
      return [];
    }

    const { result } = await resp.json();

    return result; // [] contendo linhas da tabela
  }

  const onSubmit = async (e) => {
    const [ inicio, fim ] = datas;

    const result = await gerarRelatorioDetalhadoServicoOferecido(inicio, fim);
    setShowRelatorio(true);
    console.log('result: ', result);
    setInfoRelatorio({
      inicio: inicio,
      fim: fim,
      linhas: result
    });
  } 

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      
      { showRelatorio && 
        <TabelaRelatorioDetalhadoServicoOferecido 
          inicio={infoRelatorio.inicio}
          fim={infoRelatorio.fim}
          linhas={infoRelatorio.linhas}
        />
        || 
        <Card title="Desempenho de serviços oferecidos" variant="borderless" style={{ boxShadow: 'rgba(0 0 0 / 25%) 0px 0px 10px 1px',margin: "6em",maxWidth: 'fit-content'}}>
          <Space direction="vertical" size={12}>
            <RangePicker locale={locale.DatePicker} onChange={(dates, datesStr, info) => {setDatas(datesStr)}}/>
            <Button type="primary" onClick={onSubmit} >Gerar relatório</Button>
          </Space>
        </Card>
      }
    </div>
  )
}

export default Relatorio_Detalhado;