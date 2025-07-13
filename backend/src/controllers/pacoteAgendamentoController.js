const PacoteAgendamento = require('../models/pacoteAgendamento');
const { empresa: empresaDB } = require('../db');

exports.create = async (req, res, next) => {
    let novoPac;
    idEmpresa = Number(req.params.idEmpresa);

    try {
        novoPac = {
            idEmpresa,
            ...req.body
        };
        novoPac = new PacoteAgendamento(novoPac);
    } catch (err) {
        err.message = "Erro ao instanciar objeto PacoteAgendamento: " + err.message;
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
        const idPacoteAgendamento = await novoPac.save(conn);
        await conn.query('COMMIT');

        res.json({
            success: true,
            message: "Pacote de agendamento cadastrado com sucesso!",

            pacoteAgendamento: {
                id: idPacoteAgendamento
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
    PacoteAgendamento.find({ id: Number(req.params.idPacoteAgendamento), idEmpresa: Number(req.params.idEmpresa)})
    .then( pacFound => {
        if (pacFound.length > 1) {
            next(new Error("Condição inesperada: busca por id retornou mais de um resultado"));
            return;
        }

        if (!pacFound[0]) res.status(404);

        res.json({ pacoteAgendamento: pacFound[0] ?? {} });
    })
    .catch( err => {
        next(err);
    });
};


exports.list = (req, res, next) => {

    const filter = {
        idEmpresa: Number(req.params.idEmpresa),
    };

    PacoteAgendamento.find(filter)
    .then( pacList => {
        if (pacList.length == 0) res.status(404);

        res.json( { pacotesAgendamento: [ ...pacList ] });
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
    const idPacoteAgendamento = Number(req.params.idPacoteAgendamento);
    const idEmpresa = Number(req.params.idEmpresa);

    const filter = { id: idPacoteAgendamento, idEmpresa: idEmpresa };
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

    // Buscando pelo pacote de agendamento
    let pacAtualizar;
    try {
        const [ pacEncontrado ] = await PacoteAgendamento.find(filter, options);

        if (!pacEncontrado) {
            throw new Error("Pacote de agendamento não encontrado");
        }

        pacAtualizar = pacEncontrado;
    } catch (err) {
        err.message = "Erro ao buscar pelo pacote de agendamento especificado: " + err.message;
        next(err);
        return;
    }

    try {
        pacAtualizar.estado = { id: novoEstado };
        // salvar no banco
        await conn.query('START TRANSACTION');
        const idPacoteAgendamento = await pacAtualizar.saveEstado(conn);
        await conn.query('COMMIT');

        res.json({
            success: true,
            message: "Estado de pacote de agendamento atualizado com sucesso!",

            pacoteAgendamento: {
                id: idPacoteAgendamento
            }
        });
    } catch (err) {
        await conn.query('ROLLBACK');
        next(err);
    } finally {
        conn.end();
    }
};
