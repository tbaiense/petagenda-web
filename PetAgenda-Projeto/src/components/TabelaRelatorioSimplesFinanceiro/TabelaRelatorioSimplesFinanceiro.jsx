import React from 'react';

const TabelaRelatorioSimplesFinanceiro = ({ 
    titulo, periodo, inicio, fim, incluirDespesas,
    linhas
}) => {
  return (
    <table style={{display: 'block'}}>
        <thead>
            <tr><th colSpan="5">Relatório Simples</th></tr>
            <tr><th colSpan="2">Período: {(periodo == 'mensal' ?  "Mensal" : (periodo == 'anual' ? 'Anual' : "Indefinido"))}</th><th>Abrangência: </th><th colSpan="2">{inicio} a {fim}</th></tr>
            <tr><th colSpan="2">Periodo</th><th rowSpan="2">Faturamento Bruto</th><th rowSpan="2">Despesas</th><th rowSpan="2">Faturamento Líquido</th></tr>
            <tr><th>Início</th><th>Fim</th></tr>
        </thead>
        <tbody>
            {
                linhas?.length > 0 && linhas.map( l => {
                    return (
                        <tr key={l.inicio_periodo}>
                            <td>{l.inicio_periodo}</td>
                            <td>{l.fim_periodo}</td>
                            <td>{l.bruto_periodo}</td>
                            <td>{l.desp_periodo}</td>
                            <td>{l.liquido_periodo}</td>
                        </tr>
                    );
                })
            }
            <tr><td colSpan="3"></td><td>Total:</td><td>{linhas[0].liquido_total}</td></tr>
        </tbody>
    </table>
  );  
};

export default TabelaRelatorioSimplesFinanceiro;