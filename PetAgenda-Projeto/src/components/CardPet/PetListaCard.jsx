import React from "react";
import seta from "../../assets/icon_seta.svg";
import male from "../../assets/icon_male.svg";
import female from "../../assets/icon_female.svg";
import iconEditar from "../../assets/icon_editarAzul.svg";
import iconDeletar from "../../assets/icon_delete.svg";
import styles from "./PetListaCard.module.css";
import { useNavigate } from "react-router-dom";

const PetListaCard = ({ pet: p, showInfo }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.cardInfo}>
      <div className={styles.petInfoContainer}>
        <div>
          <img
            className={styles.imagem_raca}
            src={p.sexo === "M" ? male : female}
            alt="Sexo do pet"
          />
        </div>
        <div>
          <span className={styles.nomeCliente}>{p.nome}</span>
          <div className={styles.layoutInfoPerson}>
            <span>{p.especie}</span>
            <span>|</span>
            <span>{p.dono}</span>
          </div>
        </div>
      </div>

      <div className={styles.position}>
        <div className={styles.position2}>
          <div className={styles.alinhamentoImage}>
            <img
              src={iconEditar}
              alt="Editar"
              onClick={() => navigate(`/empresa/pets/editar/${p.id}`)}
            />
          </div>
          <div className={styles.alinhamentoImage}>
            <img
              src={iconDeletar}
              alt="Deletar"
              onClick={() => {
                if (confirm("Deseja realmente deletar este pet?")) {
                  console.log("Deletar pet");
                }
              }}
            />
          </div>
        </div>
        <div>
          <img src={seta} alt="Mostrar detalhes" onClick={() => showInfo(p)} />
        </div>
      </div>
    </div>
  );
};

export default PetListaCard;
