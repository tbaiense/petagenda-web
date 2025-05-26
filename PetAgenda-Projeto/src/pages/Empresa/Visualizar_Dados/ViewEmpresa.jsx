    import ftTemp from "../../../assets/LogoNav.png"



const ViewEmpresa = () => {
    return(
        <>
            <div>
                <img src={ftTemp} alt="Foto_da_sua_empresa" />
                <div>
                    <h2>Nome da Empresa</h2>
                    <hr />
                    <h4>Razão Social | CNPJ</h4>
                    <p>Lema</p>
                </div>
            </div>

            <div>
                <div>
                    <h4>Funcionarios</h4>
                    <p>Nenhum Funcionario</p>
                </div>

                <div>
                    <h4>Serviços Oferecidos</h4>
                    <p>Nenhum Serviço Oferecido</p>
                </div>
            </div>
            
            
        </>
        
    )
}


export default ViewEmpresa