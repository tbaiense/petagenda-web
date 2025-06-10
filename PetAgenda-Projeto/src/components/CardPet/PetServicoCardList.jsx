import React from 'react'
import Accordion from 'react-bootstrap/Accordion';
import PetServicoCard from './PetServicoCard';


const PetServicoCardList = ({ petList, handleRemove }) => {

  return (
    <Accordion className="mt-3 mb-4" defaultActiveKey="0" flush alwaysOpen>
      {
        petList && petList.map( p => {
          return (
            <PetServicoCard handleRemove={handleRemove} key={p.id || p.nome + p.especie.nome} {...p} />
          );
        })
      }
    </Accordion>
  )
}

export default PetServicoCardList
