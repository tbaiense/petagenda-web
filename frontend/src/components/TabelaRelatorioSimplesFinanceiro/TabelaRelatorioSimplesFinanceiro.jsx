import React from 'react';
import { Table } from 'antd';

const { Column, ColumnGroup } = Table;

const TabelaRelatorioSimplesFinanceiro = ({ 
    titulo, periodo, inicio, fim, incluirDespesas,
    linhas
}) => {


    const columns = [
        {
            title: "Relatório Financeiro Simples",
            children: [
                {
                    title: `Período: ${(periodo == 'mensal' ? "Mensal" : (periodo == 'anual' ? "Anual" : "Indefinido"))}`,
                    children: [
                        {
                            title: 'Inicio',
                            dataIndex: 'inicio',
                            key: 'inicio',
                            width: 150,
                            align: 'center'
                        },
                        {
                            title: 'Fim',
                            dataIndex: 'fim',
                            key: 'fim',
                            width: 150,
                            align: 'center'
                        }
                    ]
                },
                {
                    title: `Abrangência:  ${inicio}  a  ${fim}`,
                    children: [
                        {
                            title: 'Faturamento Bruto',
                            dataIndex: 'bruto',
                            key: 'bruto',
                            align: 'right',
                            render: text => <span>R$ {text.toString().replace('.', ',')}</span>
                        },
                        {
                            title: 'Despesas',
                            dataIndex: 'despesas',
                            key: 'despesas',
                            align: 'right',
                            render: text => <span>R$ {text.toString().replace('.', ',')}</span>
                        },
                        {
                            title: 'Faturamento Líquido',
                            dataIndex: 'liquido',
                            key: 'liquido',
                            align: 'right',
                            render: text => <span>R$ {text.toString().replace('.', ',')}</span>
                        }
                    ]
                }
            ]
        }
      ];

      const data = linhas.map( l => {
        return {
            key: l.inicio_periodo,
            inicio: l.inicio_periodo,
            fim: l.fim_periodo,
            bruto: l.bruto_periodo,
            despesas: l.desp_periodo,
            liquido: l.liquido_periodo
        };
      });




  return (
    <Table
      columns={columns}
      dataSource={data}
      bordered
      size="large"
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4} align="right">Total Líquido:</Table.Summary.Cell>
            <Table.Summary.Cell index={1}>R$ {linhas[0]?.liquido_total}</Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  );  
};

export default TabelaRelatorioSimplesFinanceiro;