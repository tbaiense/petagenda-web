const Agendamento = require('../models/agendamento');
const { empresa: empresaDB } = require('../db');

exports.create = async (req, res, next) => {
    const {
        dtHrMarcada,
        servico,
        funcionario,
        observacoes,
        pets,
        enderecos,
    } = req.body;

    let novoAgend;
    idEmpresa = Number(req.params.idEmpresa);

    try {
        novoAgend = {
            idEmpresa,
            dtHrMarcada,
            servico,
            funcionario,
            observacoes,
            pets,
            enderecos,
        };
        novoAgend = new Agendamento(novoAgend);
    } catch (err) {
        err.message = "Erro ao instanciar objeto Agendamento: " + err.message;
        next(err);
        return;
    }

    // Obtendo conexão
    let conn;
    try {
        conn = await empresaDB.createConnection({ id: idEmpresa });
    } catch (err) {
        next(err);
        return;
    }

    try {
        // salvar no banco
        await conn.query('START TRANSACTION');
        const idAgendamento = await novoAgend.save(conn);
        await conn.query('COMMIT');

        res.json({
            success: true,
            message: "Agendamento cadastrado com sucesso!",

            agendamento: {
                id: idAgendamento
            }
        });
    } catch (err) {
        await conn.query('ROLLBACK');
        next(err);
    } finally {
        conn.end();
    }
};

exports.info = (req, res, next) => {
    Agendamento.find({ id: Number(req.params.idAgendamento), idEmpresa: Number(req.params.idEmpresa)})
    .then( ([qtdAgendamento, agendFound]) => {
        if (agendFound.length > 1) {
            next(new Error("Condição inesperada: busca por id retornou mais de um resultado"));
            return;
        }

        if (!agendFound[0]) res.status(404);

        res.json({ agendamento: agendFound[0] ?? {} });
    })
    .catch( err => {
        next(err);
    });
};

// ?query=Thiago+Moura+Baiense&option=cliente&order=ascending
exports.list = (req, res, next) => {

    const {
        page,
        limit,
        option,
        order,
        query
    } = req.query;

    const filter = {
        idEmpresa: Number(req.params.idEmpresa),
        option,
        query,
        estado: req.query.estado
    };

    console.log(filter);

    const options = {
        ordenacao: req.query.ordenacao,
        limit: (Number.isInteger(+limit)) ? +limit : 5,
        page: (Number.isInteger(+page)) ? +page : 0
    };

    Agendamento.find(filter, options)
    .then( ([qtdAgendamento, agendList]) => {
        if (agendList.length == 0) res.status(404);

        res.json( { qtdAgendamento: qtdAgendamento, agendamentos: [ ...agendList ] });
    })
    .catch( err => {
        next(err);
    });

};

exports.update = (req, res, next) => {
    res.send("NOT IMPLEMENTED YET: pet UPDATE");
};

exports.delete = (req, res, next) => {
    res.send("NOT IMPLEMENTED YET: pet DELETE");
};

exports.updateEstado = async (req, res, next) => {
    const idAgendamento = Number(req.params.idAgendamento);
    const idEmpresa = Number(req.params.idEmpresa);

    const filter = { id: idAgendamento, idEmpresa: idEmpresa };
    const options = { useClass: true };
    const {
        id: novoEstado
    } = req.body;

    // Obtendo conexão
    let conn;
    try {
        conn = await empresaDB.createConnection({ id: idEmpresa });
    } catch (err) {
        next(err);
        return;
    }

    // Buscando pelo agendamento
    let agendAtualizar;
    try {
        const [ qtdAgendamento, [ agendEncontrado ]] = await Agendamento.find(filter, options);

        if (!agendEncontrado) {
            throw new Error("Agendamento não encontrado");
        }

        agendAtualizar = agendEncontrado;
    } catch (err) {
        err.message = "Erro ao buscar pelo agendamento especificado: " + err.message;
        next(err);
        return;
    }

    try {
        agendAtualizar.estado = { id: novoEstado };
        // salvar no banco
        await conn.query('START TRANSACTION');
        const idAgendamento = await agendAtualizar.saveEstado(conn);
        await conn.query('COMMIT');

        res.json({
            success: true,
            message: "Estado de agendamento atualizado com sucesso!",

            agendamento: {
                id: idAgendamento
            }
        });
    } catch (err) {
        await conn.query('ROLLBACK');
        next(err);
    } finally {
        conn.end();
    }
};

exports.updateFuncionario = async (req, res, next) => {
    const idAgendamento = Number(req.params.idAgendamento);
    const idEmpresa = Number(req.params.idEmpresa);

    const filter = { id: idAgendamento, idEmpresa: idEmpresa };
    const options = { useClass: true };
    const {
        id: novoFuncionario
    } = req.body;

    // Obtendo conexão
    let conn;
    try {
        conn = await empresaDB.createConnection({ id: idEmpresa });
    } catch (err) {
        next(err);
        return;
    }

    // Buscando pelo agendamento
    let agendAtualizar;
    try {
        const [ qtdAgendamento, [ agendEncontrado ] ] = await Agendamento.find(filter, options);

        if (!agendEncontrado) {
            throw new Error("Agendamento não encontrado");
        }

        agendAtualizar = agendEncontrado;
    } catch (err) {
        err.message = "Erro ao buscar pelo agendamento especificado: " + err.message;
        next(err);
        return;
    }

    try {
        agendAtualizar.funcionario = { id: novoFuncionario };
        // salvar no banco
        await conn.query('START TRANSACTION');
        const idAgendamento = await agendAtualizar.saveFuncionario(conn);
        await conn.query('COMMIT');

        res.json({
            success: true,
            message: "Funcionário atribuído atualizado com sucesso!",

            agendamento: {
                id: idAgendamento
            }
        });
    } catch (err) {
        await conn.query('ROLLBACK');
        next(err);
    } finally {
        conn.end();
    }
};
