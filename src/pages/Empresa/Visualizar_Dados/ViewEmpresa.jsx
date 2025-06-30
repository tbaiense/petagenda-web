import ftTemp from "../../../assets/LogoNav.png";
import NavEmpresa from "../../../components/navegacaoEmpresa/NavEmpresa.jsx";
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import styles from "./ViewEmpresa.module.css"
import iconEditar from "../../../assets/icon_editar.svg"
import iconPerson from "../../../assets/icon_person.svg"


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

  const navEditarEmpresa = () => {
    // Aqui eu envio o objeto empresa para a pagina de editar
    navigate('/empresa/editar', {state:empresas})
  }

  return (
    <div>
      <NavEmpresa infoEmpresa={getEmpresa()}/>



      <div className={styles.firstInfo}>

        {/* Aqui é a foto */}

        <div className={styles.foto}>

          {empresas?.foto ? (
            <img src={empresas?.foto} alt="Foto da empresa"/>
          ) : (
            <img src={iconPerson}/>
          )}
        </div>

        <div className={styles.littleContent}>

          <div className={styles.estiloNome}>
            <span className={styles.nomeEmpresa}><strong>{empresas?.nomeFantasia || "Carregando..."}</strong></span>
            <img src={iconEditar} alt="" onClick={navEditarEmpresa} className={styles.icone}/>
          </div>

          <hr />
          <div className={styles.razaoCnpj}>
            <span>{empresas?.razaoSocial}</span>
            <span>|</span>
            <span>{empresas?.cnpj}</span>
            
          </div>
          {empresas?.lema ? (
              <span className={styles.lema}>{empresas?.lema}</span>
            ) : (
              <span className={styles.lema}>Não há lema</span>
            )}
          
        </div>

      </div>

      <hr />

      <div className={styles.layoutSubInfo}>

        <div className={styles.coluna}>
          <div className={styles.subTitulos}>
            <span className={styles.nomeInfo}>Funcionários</span>
            <span className={styles.mais} onClick={navFuncionario}>+</span>
          </div>
          <div className={styles.orgCard}>
            {/* cards de funcionario */}

            {funcionarios?.length > 0 ? (
              funcionarios?.map((funcionario) => (
               <div key={funcionario.id} className={styles.cardInfo}>
                  <span>{funcionario.nome}</span>
                  <span>{funcionario.telefone}</span>
               </div>
              ))
            ) : (
              <div>
                <span className={styles.cardInfo}>Nenhum serviço cadastrado</span>
              </div>
            )}
          </div>

        </div>

        <div className={styles.coluna}>
          <div className={styles.subTitulos}>
            <span className={styles.nomeInfo}>Serviços Oferecidos</span>
            <span className={styles.mais} onClick={navServico}>+</span>
          </div>
          <div className={styles.orgCard}>
            {/* cards de serviço */}

            {servicos?.length > 0 ? (
              servicos?.map((servico) => (
               <div key={servico.id} className={styles.cardInfo}>
                  <span>{servico.nome}</span>
                  <span>{servico.nomeCategoria}</span>
               </div>
              ))
            ) : (
              <div className={styles.cardInfo}>
                <span>Nenhum serviço cadastrado</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ViewEmpresa;
