const Funcionario = require('../models/funcionario');
const { empresa: empresaDB } = require('../db');

exports.create = async (req, res, next) => {
    const {
        nome, telefone, exerce
    } = req.body;

    let novoFuncionario;
    idEmpresa = Number(req.params.idEmpresa);
    try {
        novoFuncionario = {
            idEmpresa,
            nome, telefone, exerce
        };

        novoFuncionario = new Funcionario(novoFuncionario);
    } catch (err) {
        err.message = "Erro ao instanciar objeto Funcionario: " + err.message;
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
        const idFuncionario = await novoFuncionario.save(conn);

        await conn.query('COMMIT');
        res.json({
            success: true,
            message: "Funcionário cadastrado com sucesso!",

            funcionario: {
                id: idFuncionario
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
    Funcionario.find({ id: Number(req.params.idFuncionario), idEmpresa: Number(req.params.idEmpresa)})
    .then( funcFound => {
        if (funcFound.length > 1) {
            next(new Error("Condição inesperada: busca por id retornou mais de um resultado"));
            return;
        }

        if (!funcFound[0]) res.status(404);

        res.json( { funcionario: funcFound[0] ?? {} });
    })
    .catch( err => {
        next(err);
    });
};

exports.list = (req, res, next) => {
    const filter = {
        idEmpresa: Number(req.params.idEmpresa),
        query: req.query.query,
        option: req.query.option
    };

    const options = {
        ordenacao: req.query.ordenacao
    };

    Funcionario.find(filter, options)
    .then( funcList => {
        if (funcList.length == 0) res.status(404);

        res.json( { funcionarios: funcList });
    })
    .catch( err => {
        next(err);
    });};

exports.update = async (req, res, next) => {
    const id = +req.params.idFuncionario;
    const {
        nome, telefone, exerce
    } = req.body;

    let funcEditado;
    idEmpresa = Number(req.params.idEmpresa);
    try {
        funcEditado = {
            idEmpresa,
            id,
            nome, telefone, exerce
        };

        funcEditado = new Funcionario(funcEditado);
    } catch (err) {
        err.message = "Erro ao instanciar objeto Funcionario: " + err.message;
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
        const idFuncionario = await funcEditado.save(conn);

        await conn.query('COMMIT');
        res.json({
            success: true,
            message: "Funcionário editado com sucesso!",

            funcionario: {
                id: idFuncionario
            }
        });
    } catch (err) {
        await conn.query('ROLLBACK');
        next(err);
    } finally {
        conn.end();
    }
};

exports.delete = (req, res, next) => {
    res.send("NOT IMPLEMENTED YET: funcionario DELETE");
};
