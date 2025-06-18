import ftTemp from "../../../assets/LogoNav.png";
import NavEmpresa from "../../../components/navegacaoEmpresa/NavEmpresa.jsx";
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/UserContext';
import { data, useNavigate } from "react-router-dom";
import styles from "./ViewEmpresa.module.css"
import iconEditar from "../../../assets/icon_editar.svg"


const ViewEmpresa = () => {
  const { getEmpresa, empresaFetch, apiFetch } = useAuth();
  const navigate = useNavigate();
  const empresa = getEmpresa();
  const [empresas, setEmpresas] = useState()
  const [servicos, setServicos] = useState();
  const [funcionarios, setFuncionarios] = useState();

  async function popularServicosOferecidos() {
    empresaFetch('/servico-oferecido')
      .then(res => res.json())
      .then(data => {
        setServicos(data.servicosOferecidos);
      })
      .catch(error => {
          console.error("Erro ao buscar serviçoes oferecidos:", error);
      });
  }

  async function popularFuncionarios() {
    empresaFetch('/funcionario')
      .then(res => res.json())
      .then(data => {
          setFuncionarios(data.funcionarios);
      })
      .catch(error => {
          console.error("Erro ao buscar Funcionarios:", error);
      });
  }
  
  async function popularEmpresa() {
    empresaFetch('')
      .then(res => res.json())
      .then((data) => {
          setEmpresas(data.empresa);

          console.log("Peguei empresa: ",data)
      })
      .catch(error => {
          console.error("Erro ao buscar Funcionarios:", error);
      });

  }
  

  useEffect(() => {
    popularServicosOferecidos();
    popularFuncionarios()
    popularEmpresa()

    if (!empresa) {
      navigate('/empresa/cadastrar');
    } else if (!empresa.licenca) {
      navigate('/empresa/planos');
    }
  }, []);

  useEffect(() => {
    console.log("Peguei Funcionarios: ",funcionarios)
    console.log("Peguei serviços: ",servicos)
    console.log("Peguei empresa: ",empresas)
  },[funcionarios,servicos,empresas])



  const navFuncionario = () => {
    navigate("/empresa/funcionarios")
  }

  const navServico = () => {
    navigate("/empresa/servicos/cadastrar")
  }

  

  return (
    <div>
      <NavEmpresa infoEmpresa={getEmpresa()}/>



      <div className={styles.firstInfo}>

        {/* Aqui é a foto */}

        <div className={styles.foto}>
          <span>foto</span>
        </div>

        <div className={styles.littleContent}>

          <div className={styles.estiloNome}>
            <span className={styles.nomeEmpresa}><strong></strong></span>
            <img src={iconEditar} alt="" />
          </div>

          <hr />
          <div className={styles.razaoCnpj}>
            <span>essa é a minha razão social</span>
            <span>|</span>
            <span>12345678966</span>
          </div>

          <span className={styles.lema}><i>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quia </i></span>
          
        </div>

      </div>

      <hr />

      <div className={styles.layoutSubInfo}>

        <div className={styles.coluna}>
          <div className={styles.subTitulos}>
            <span className={styles.nomeInfo}>Funcionários</span>
            <span className={styles.mais} onClick={navFuncionario}>+</span>
          </div>
          <div>
            {/* cards funcionarios */}
            <div>

            </div>
          </div>

        </div>

        <div className={styles.coluna}>
          <div className={styles.subTitulos}>
            <span className={styles.nomeInfo}>Serviços Oferecidos</span>
            <span className={styles.mais} onClick={navServico}>+</span>
          </div>
          <div>
            {/* cards de serviço */}
            <div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ViewEmpresa;
