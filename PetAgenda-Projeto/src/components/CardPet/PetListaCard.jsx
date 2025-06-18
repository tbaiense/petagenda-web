import React from "react";
import seta from "../../assets/icon_seta.svg";
import male from "../../assets/icon_male.svg";
import female from "../../assets/icon_female.svg";
import styles from "./PetListaCard.module.css";
const PetListaCard = ({ pet: p, showInfo }) => {
  return (
    <div className={styles.miniCard}>
      <div className={styles.suporte}>
        <div className={styles.male}>
          <img
            className={styles.imagem_raca}
            src={p.sexo == "M" ? male : female}
            alt=""
          />
        </div>
        <div className={styles.subInfo}>
          <span className={styles.estiloNome}>{p.nome}</span>
          <span className={styles.estiloEspecie}>{p.especie}</span>
          <span className={styles.estiloDono}>{p.dono}</span>
        </div>
      </div>
      <div>
        <button onClick={() => showInfo()} className={styles.bttn}>
          <img src={seta} alt="seta" />
        </button>
      </div>
    </div>
  );
};

export default PetListaCard;
