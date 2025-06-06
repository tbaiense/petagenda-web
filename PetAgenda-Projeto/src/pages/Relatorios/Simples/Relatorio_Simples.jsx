import styles from "./Relatorio_Simples.module.css"
import { useForm } from "react-hook-form";

const Relatorios = () => {

  const {
    register,
    handleSubmit,
    formState:{errors},
    reset,
    watch
  } = useForm();

  const onSubmit = (data) => {
    console.log("Aqui esta os dados:",dados)
  }

  const onErrors = (errors) => {
    console.log("Erro:",dados)
  }

  return (
    <div className={styles.backgroudFormulario}>

      <form className={styles.estiloFormulario} onSubmit={handleSubmit(onSubmit, onErrors)}>
        <h2>Financeiro</h2>

        <div className={styles.espacamento}>

          <div className={styles.estiloCampos}>
            <label htmlFor="">Perído:</label>
            <select {...register("periodo", {required:true})}>
              <option value="">Mensal</option>
              {/* <option value="">Trimestral</option> */}
              <option value="">Anual</option>
            </select>
          </div>

          <div className={styles.estiloCampos}>
            <label>Incluir Despesas:</label>
            <input type="checkbox" {...register("periodo", {required:true})}/>
          </div>

          <div className={styles.estiloCampos}>
            <label>Início:</label>
            <input type="date" {...register("periodo", {required:true})}/>
          </div>

          <div className={styles.estiloCampos}>
            <label>Fim:</label>
            <input type="date" {...register("periodo", {required:true})}/>
          </div>

        </div>

        <div className={styles.bttn}>
            <button type="submit">Gerar Relatório</button>
        </div>

      </form>

    </div>
  )
}

export default Relatorios