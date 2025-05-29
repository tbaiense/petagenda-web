import { UFS } from "../../data/info"


const CamposEndereco = ({index, register}) => {
    console.log("Renderizando endereço", index);
    return(
        <>
            <div>
                <label htmlFor="">Logradouro</label>
                <input type="text" />
            </div>

            <div>
                <label htmlFor="">Número</label>
                <input type="text" />
            </div>

            <div>
                <label htmlFor="">Bairro</label>
                <input type="text" />
            </div>

            <div>
                <label htmlFor="">Cidade</label>
                <input type="text" />
            </div>

            <select >
                <option value="">UF</option>
                {UFS.map((UF, index) => (
                    <option key={index} value={UF}>{UF}</option>
                ))}
            </select>
        </>
    )
}

export default CamposEndereco