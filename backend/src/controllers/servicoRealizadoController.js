const ServicoRealizado = require('../models/servicoRealizado');
const { empresa: empresaDB } = require('../db');

exports.create = async (req, res, next) => {
    let novoServReal;
    idEmpresa = Number(req.params.idEmpresa);

    try {
        novoServReal = {
            ...req.body,
            idEmpresa,
        };
        novoServReal = new ServicoRealizado(novoServReal);
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
        const idServicoRealizado = await novoServReal.save(conn);
        await conn.query('COMMIT');

        res.json({
            success: true,
            message: "Serviço realizado cadastrado com sucesso!",

            servicoRealizado: {
                id: idServicoRealizado
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
    ServicoRealizado.find({ id: Number(req.params.idServicoRealizado), idEmpresa: Number(req.params.idEmpresa)})
    .then( ({servList}) => {
        if (servList.length > 1) {
            next(new Error("Condição inesperada: busca por id retornou mais de um resultado"));
            return;
        }

        if (!servList[0]) res.status(404);

        res.json({ servicoRealizado: servList[0] ?? {} });
    })
    .catch( err => {
        next(err);
    });
};


exports.list = (req, res, next) => {
    const {
        page,
        limit,
        query,
        option
    } = req.query;

    const filter = {
        idEmpresa: Number(req.params.idEmpresa),
        query,
        option
    };

    const options = {
        ordenacao: req.query.ordenacao,
        limit: (Number.isInteger(+limit)) ? +limit : 5,
        page: (Number.isInteger(+page)) ? +page : 0
    };

    ServicoRealizado.find(filter, options)
    .then( ({ qtdServicosRealizados, servList }) => {
        if (servList.length == 0) res.status(404);

        res.json( { qtdServicosRealizados, servicosRealizados: [ ...servList ] });
    })
    .catch( err => {
        next(err);
    });

};

exports.update = async (req, res, next) => {
    let servicoRealEditado;
    idEmpresa = Number(req.params.idEmpresa);
    const id = +req.params.idServicoRealizado;

    const { inicio, fim, funcionario } = req.body;

    try {
        const { servList } = await ServicoRealizado.find({ id: id, idEmpresa: idEmpresa }, { useClass: true });

        console.log(servList);

        if (servList.length == 0) {
            throw new Error('Falha ao buscar por registro de serviço realizado');
        }

        const servFound = servList[0];

        servFound.inicio = inicio;
        servFound.fim = fim;
        servFound.funcionario = funcionario;

        servicoRealEditado = servFound;
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
        const idServicoRealizado = await servicoRealEditado.save(conn);
        await conn.query('COMMIT');

        res.json({
            success: true,
            message: "Serviço realizado atualizado com sucesso!",

            servicoRealizado: {
                id: idServicoRealizado
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
    res.send("NOT IMPLEMENTED YET: pet DELETE");
};
