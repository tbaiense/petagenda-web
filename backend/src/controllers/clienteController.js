const Cliente = require('../models/cliente');
const { empresa: empresaDB } = require('../db');

exports.create = async (req, res, next) => {
    const {
        nome, telefone, endereco, servicoRequerido
    } = req.body;

    let novoCliente;
    idEmpresa = Number(req.params.idEmpresa);
    try {
        novoCliente = {
            idEmpresa,
            nome, telefone, endereco, servicoRequerido
        };
        novoCliente = new Cliente(novoCliente);
    } catch (err) {
        err.message = "Erro ao instanciar objeto Cliente: " + err.message;
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
        const idCliente = await novoCliente.save(conn);

        await conn.query('COMMIT');
        res.json({
            success: true,
            message: "Cliente cadastrado com sucesso!",

            cliente: {
                id: idCliente
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
    Cliente.find({ id: Number(req.params.idCliente), idEmpresa: Number(req.params.idEmpresa)})
    .then( cliFound => {
        if (cliFound.length > 1) {
            next(new Error("Condição inesperada: busca por id retornou mais de um resultado"));
            return;
        }

        if (!cliFound[0]) res.status(404);

        res.json( { cliente: cliFound[0] ?? {} });
    })
    .catch( err => {
        next(err);
    });
};

exports.list = (req, res, next) => {
    const options = {
        ordenacao: req.query.ordenacao
    };

    const filter = {
        query: req.query.query,
        option: req.query.option
    };

    Cliente.find({ idEmpresa: Number(req.params.idEmpresa), ...filter}, options)
    .then( cliList => {
        if (cliList.length == 0) res.status(404);

        res.json( { clientes: cliList });
    })
    .catch( err => {
        next(err);
    });};

exports.update = async (req, res, next) => {
    const id = +req.params.idCliente;

    const {
        nome, telefone, endereco, servicoRequerido
    } = req.body;

    let clienteEditado;
    idEmpresa = Number(req.params.idEmpresa);
    try {
        clienteEditado = {
            idEmpresa,
            id,
            nome, telefone, endereco, servicoRequerido
        };
        clienteEditado = new Cliente(clienteEditado);
    } catch (err) {
        err.message = "Erro ao instanciar objeto Cliente: " + err.message;
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
        const idCliente = await clienteEditado.save(conn);

        await conn.query('COMMIT');
        res.json({
            success: true,
            message: "Cliente atualizado com sucesso!",

            cliente: {
                id: idCliente
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
    res.send("NOT IMPLEMENTED YET: cliente DELETE");
};
