const CardServicoRealizado = ({ servicoRealizado, setServicosRealizados }) => {
  const [show, setShow] = useState(false);

  const handleShowEditarModal = () => {
    setShow(true);
  };

  const atualizarNaLista = (novoServico) => {
    setServicosRealizados((prev) =>
      prev.map((s) => (s.id === novoServico.id ? novoServico : s))
    );
  };

  return (
    <>
      <tr>
        <td>{servicoRealizado.servico.nome}</td>
        <td>{servicoRealizado.cliente.nome}</td>
        <td>{servicoRealizado.funcionario.nome}</td>
        <td>
          <div>
            {servicoRealizado.inicio &&
              servicoRealizado.inicio.replace(/ \d\d:\d\d:\d\d/, "")}
          </div>
          <br />
          ~2 meses
        </td>
        <td>
          {servicoRealizado.inicio &&
            servicoRealizado.inicio.replace(/\d{4}-\d{2}-\d{2} /, "")}
        </td>
        <td>
          {servicoRealizado.fim &&
            servicoRealizado.fim.replace(/\d{4}-\d{2}-\d{2} /, "")}
        </td>
        <td>{`R$ ${servicoRealizado.valor.total}`}</td>
        <td>
          <Button className="form-button" variant="primary" onClick={handleShowEditarModal}>
            Atualizar
          </Button>
          <Button className="form-button" variant="success">
            Visualizar
          </Button>
        </td>
      </tr>
      <Modal_Atualizar_Rapido_ServicoRealizado
        show={show}
        setShow={setShow}
        servicoRealizado={servicoRealizado}
        setServicoRealizado={atualizarNaLista}
      />
    </>
  );
};

export default CardServicoRealizado;
