const { empresa: empresaDB } = require('../db');

exports.simplesFinanceiro = async (req, res, next) => {
    const idEmpresa = +req.params.idEmpresa;
    const inicio = req.query.inicio;
    const fim = req.query.fim;
    const periodo = req.query.periodo;

    let conn;
    try {
        conn = await empresaDB.createConnection({ id: idEmpresa });

        const [ [ result ] ] = await conn.execute(
            `CALL relatorio_simples_financeiro(?, ?, ?)`,
            [periodo, inicio, fim]
        );

        res.json({ result: result });
    } catch (err) {
        err.message = 'Falha ao gerar relatório: ' + err.message;
        next(err);
    }
};

exports.detalhadoServicoOferecido = async (req, res, next) => {
    const idEmpresa = +req.params.idEmpresa;
    const inicio = req.query.inicio;
    const fim = req.query.fim;

    let conn;
    try {
        conn = await empresaDB.createConnection({ id: idEmpresa });

        const [ [ result ] ] = await conn.execute(
            `CALL relatorio_detalhado_servico_oferecido(?, ?)`,
            [inicio, fim]
        );

        res.json({ result: result });
    } catch (err) {
        err.message = 'Falha ao gerar relatório: ' + err.message;
        next(err);
    }
};
