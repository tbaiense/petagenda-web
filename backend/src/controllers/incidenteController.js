const Incidente = require('../models/incidente');
const { empresa: empresaDB } = require('../db');

exports.create = async (req, res, next) => {
    let novoInc;
    idEmpresa = Number(req.params.idEmpresa);

    try {
        novoInc = {
            ...req.body,
            idEmpresa,
        };
        novoInc = new Incidente(novoInc);
    } catch (err) {
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
        const idIncidente = await novoInc.save(conn);
        await conn.query('COMMIT');

        res.json({
            success: true,
            message: "Incidente cadastrado com sucesso!",

            incidente: {
                id: idIncidente
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
    Incidente.find({ id: Number(req.params.idIncidente), idEmpresa: Number(req.params.idEmpresa)})
    .then( incFound => {
        if (incFound.length > 1) {
            next(new Error("Condição inesperada: busca por id retornou mais de um resultado"));
            return;
        }

        if (!incFound[0]) res.status(404);

        res.json({ incidente: incFound[0] ?? {} });
    })
    .catch( err => {
        next(err);
    });
};


exports.list = (req, res, next) => {

    const filter = {
        idEmpresa: Number(req.params.idEmpresa),
    };

    Incidente.find(filter)
    .then( incList => {
        if (incList.length == 0) res.status(404);

        res.json( { incidentes: [ ...incList ] });
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
