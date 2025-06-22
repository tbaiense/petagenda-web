import React from 'react';
import { Table } from 'antd';

const TabelaRelatorioDetalhadoServicoOferecido = ({ 
    titulo, inicio, fim, incluirDespesas,
    linhas
}) => {


    const columns = [
        {
            title: "DESEMPENHO DE SERVIÇO DETALHADO",
            children: [
                {
                    title: `Abrangência:  ${inicio}  a  ${fim}`,
                    children: [
                        {
                            title: 'Categoria',
                            dataIndex: 'categoria',
                            key: 'categoria',
                            align: 'left',
                        },
                        {
                            title: 'Serviço',
                            dataIndex: 'servico',
                            key: 'servico',
                            align: 'left',
                        },
                        {
                            title: 'Qtd.',
                            dataIndex: 'qtd',
                            key: 'qtd',
                            align: 'right',
                        },
                        {
                            title: 'Preço médio',
                            dataIndex: 'medio',
                            key: 'medio',
                            align: 'right',
                            render: text => <span>R$ {text.toString().replace('.', ',')}</span>
                        }
                        ,
                        {
                            title: 'Total',
                            dataIndex: 'total',
                            key: 'total',
                            align: 'right',
                            render: text => <span>R$ {text.toString().replace('.', ',')}</span>
                        }
                    ]
                }
            ]
        }
      ];

    //   "id_servico_oferecido": 3,
    //   "nome": "Pet Sitting para cães",
    //   "id_categoria": 1,
    //   "nome_categoria": "Pet Sitting",
    //   "preco": 120,
    //   "inicio_periodo": "2010-10-01 00:00:00",
    //   "fim_periodo": "2024-12-20 00:00:00",
    //   "qtd_serv_periodo": 7,
    //   "media_valor": 120,
    //   "soma_valor": 840

      const data = linhas.map( l => {
        return {
            key: l.id_servico_oferecido,
            total: l.soma_valor,
            qtd: l.qtd_serv_periodo,
            medio: l.media_valor,
            servico: l.nome,
            categoria: l.nome_categoria
        };
      });




  return (
    <Table
      columns={columns}
      dataSource={data}
      bordered
      size="large"
    />
  );  
};

export default TabelaRelatorioDetalhadoServicoOferecido;