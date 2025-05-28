import { useEffect, useState } from "react"
import styles from "./CadastrarPets.module.css"
import { useLocation } from "react-router-dom"
import api from  '../../api';
import { useAuth } from '../../contexts/UserContext';

const CadastrarPets = () => {
  const locate = useLocation()
  const infoCliente = locate.state
  const [clientes, setClientes] = useState([])
  const { token } = useAuth();
  const [aceito, setAceito] = useState(false);

  useEffect(() => {
    if(infoCliente){
      localStorage.setItem('dadosCliente',JSON.stringify(infoCliente))
    }
    fetch(`${api.URL}/empresa/:id/cliente`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
        // Converto os Serviços em JSON 
        .then(res => res.json())
        .then(data => {
            setServicos(data);
        })
        .catch(error => {
            console.error("Erro ao buscar Clientes:", error);
        });

  },[infoCliente])

  return (
    <div>
      <div>
        <h1>Cadastrar Pet</h1>
        <hr />
      </div>
      <form action="">
        <div>
          <label htmlFor="">Dono</label>
          <select>
            {infoCliente ? (
              <option value={infoCliente.id}>{infoCliente.nome}</option>
            ) : (
              <>
                <option value="">Selecione um dono</option>
                {clientes.map((cliente, index) => (
                  <option value={cliente.id} key={index}>
                    {cliente.nome}
                  </option>
                ))}
              </>
            )}
          </select>
            <div>
              <label htmlFor="">Nome do Pet</label>
              <input type="text" placeholder="Digite o nome do pet"/>
            </div>
        </div>
        <div>
          <div>
            <label htmlFor="">Especie</label>
            <input type="text" placeholder="Digite o nome da especie" />
          </div>
          <div>
            <label htmlFor="">Sexo</label>
            <select>
                <option value="">Sexo</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="">Raça</label>
            <input type="text" placeholder="Digite o nome da Raça"/>
          </div>
        </div>
        <div>
          <label htmlFor="">Castrado?</label>
          <input type="checkbox" checked={aceito} onChange={(e) => setAceito(e.target.checked)}/>
          <div>
            <label htmlFor="">Comportamento</label>
            <textarea placeholder="Descreva o comportamentodo pet" className={styles.inputTextArea}></textarea>
          </div>
        </div>
        <hr />
        <div>
          <h3>Cartão de Vacina</h3>
          <div>
            <input type="file" />
            <label htmlFor="">Saúde</label>
            <textarea className={styles.inputTextArea} placeholder="Descreva o comportamentodo pet"></textarea>
          </div>
        </div>
        
        <button type="submit">Cadastrar</button>
      </form>

    </div>
  )
}

export default CadastrarPets