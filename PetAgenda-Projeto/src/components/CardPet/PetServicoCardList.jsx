import React from 'react'
import Accordion from 'react-bootstrap/Accordion';
import PetServicoCard from './PetServicoCard';


const PetServicoCardList = ({ petList }) => {

  const test = [
    {
      id: 1,
      idPetServico: 10,
      nome: "Frederico",
      especie: "Cão",
      sexo: "Macho",
      remedios: [
        {
          id: 1,
          nome: "Dipirona",
          instrucoes: "Dar após todas as refeições, fornecendo água e descanso pleno para o animal."
        },
        {
          id: 2,
          nome: "Dipirona",
          instrucoes: "Dar após todas as refeições, fornecendo água e descanso pleno para o animal."
        }
      ],
      alimentacao: "Fornecer 2kg de comida a todo momento para manter o pet feliz e rechonchudo :)"
    },
    {
      id: 2,
      idPetServico: 10,
      nome: "Frederico",
      especie: "Cão",
      sexo: "Macho",
      remedios: [
        {
          id: 3,
          nome: "Dipirona",
          instrucoes: "Dar após todas as refeições, fornecendo água e descanso pleno para o animal."
        },
        {
          id: 4,
          nome: "Dipirona",
          instrucoes: "Dar após todas as refeições, fornecendo água e descanso pleno para o animal."
        }
      ],
      alimentacao: "Fornecer 2kg de comida a todo momento para manter o pet feliz e rechonchudo :)"
    }
  ];

  petList = test;

  return (
    <Accordion className="mt-3 mb-4" defaultActiveKey="0" flush alwaysOpen>
      {
        petList && petList.map( p => {
          return (
            <PetServicoCard key={p.id || p.nome + p.especie.nome} {...p} />
          );
        })
      }
    </Accordion>
  )
}

export default PetServicoCardList
