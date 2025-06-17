import React from 'react'
import Accordion from 'react-bootstrap/Accordion';
import PetServicoCard from './PetServicoCard';


const PetServicoCardList = ({ petList, setPetList }) => {
  return (
    <Accordion className="mt-3 mb-4" defaultActiveKey="0" flush alwaysOpen>
      {
        petList && petList.map( p => {
          return (
            <PetServicoCard key={p.id || p.nome + p.especie.nome} pet={p} petList={petList} setPetList={setPetList}/>
          );
        })
      }
    </Accordion>
  )qqew
}

export default PetServicoCardList
