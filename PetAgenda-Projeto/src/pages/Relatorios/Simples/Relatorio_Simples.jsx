import styles from "./Relatorio_Simples.module.css"
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/UserContext';
import React, { useState } from 'react';

import TabelaRelatorioSimplesFinanceiro from '../../../components/TabelaRelatorioSimplesFinanceiro/TabelaRelatorioSimplesFinanceiro';

const Relatorios = () => {
  const [ showRelatorio, setShowRelatorio ] = useState(false);
  const [ infoRelatorio, setInfoRelatorio ] = useState({});
  const {
    register,
    handleSubmit,
    formState:{errors},
    reset,
    getValues,
    watch
  } = useForm();

  const navigate = useNavigate();

  const { empresaFetch } = useAuth();

  async function gerarRelatorioSimplesFinanceiro(periodo, inicio, fim) {
    const resp = await empresaFetch(`/relatorio/simples/financeiro?periodo=${periodo}&inicio=${inicio}&fim=${fim}`);

    if (resp.status != 200) {
      return [];
    }

    const { result } = await resp.json();

    return result; // [] contendo linhas da tabela
  }

  const onSubmit = async (data) => {
    const periodo = getValues('periodo');
    const inicio = getValues('inicio');
    const fim = getValues('fim');

    const result = await gerarRelatorioSimplesFinanceiro(periodo, inicio, fim);
    setShowRelatorio(true);
    console.log('result: ', result);
    setInfoRelatorio({
      periodo: periodo,
      inicio: inicio,
      fim: fim,
      linhas: result
    });
  }

  const onErrors = (errors) => {
    console.log("Erro:", errors)
  }

  return (
    <div className={styles.backgroudFormulario}>
      { showRelatorio && 
        <TabelaRelatorioSimplesFinanceiro 
          periodo={infoRelatorio.periodo}
          inicio={infoRelatorio.inicio}
          fim={infoRelatorio.fim}
          linhas={infoRelatorio.linhas}
        />
        || 
        <form className={styles.estiloFormulario} onSubmit={handleSubmit(onSubmit, onErrors)}>
          <h2>Financeiro</h2>

          <div className={styles.espacamento}>

            <div className={styles.estiloCampos}>
              <label htmlFor="">Perído:</label>
              <select {...register("periodo", {required:true})}>
                <option value="mensal">Mensal</option>
                {/* <option value="">Trimestral</option> */}
                <option value="anual">Anual</option>
              </select>
            </div>

            <div className={styles.estiloCampos}>
              <label>Incluir Despesas:</label>
              <input type="checkbox" {...register("incluirDespesas", {required:false})}/>
            </div>

            <div className={styles.estiloCampos}>
              <label>Início:</label>
              <input type="date" {...register("inicio", {required:true})}/>
            </div>

            <div className={styles.estiloCampos}>
              <label>Fim:</label>
              <input type="date" {...register("fim", {required:true})}/>
            </div>

          </div>

          <div className={styles.bttn}>
              <button type="submit">Gerar Relatório</button>
          </div>

        </form>
      }
    </div>
  )
}

export default Relatorios