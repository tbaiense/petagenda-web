const Licenca = require('../models/licenca');
const { dbo } = require('../db');

exports.set = async (req, res, next) => {
    let novaLicenca;
    const idEmpresa = Number(req.params.idEmpresa);
    try {
        const { tipo, periodo } = req.body;

        if (tipo != 'basico' && tipo != 'profissional' && tipo != 'corporativo') {
            throw new Error("Tipo de licença inválido");
        }

        let mesOffset;
        switch (periodo) {
            case 'mensal': {
                mesOffset = 1;
                break;
            }
            case 'trimestral': {
                mesOffset = 3;
                break;
            }
            case 'anual': {
                mesOffset = 12;
                break;
            }
            default: {
                throw new Error('Período de licença inválido');
            }
        }

        let agora = new Date();
        let inicio = `${agora.getFullYear()}-${agora.getMonth() + 1}-${agora.getDay() + 1}`;

        let fim = new Date();
        const mesFinal = fim.getMonth() + mesOffset;
        fim.setMonth(mesFinal);
        fim = `${fim.getFullYear()}-${fim.getMonth() + 1}-${fim.getDay() + 1}`;

        novaLicenca = {
            idEmpresa,
            tipo,
            inicio,
            fim
        };

        novaLicenca = new Licenca(novaLicenca);
    } catch (err) {
        err.message = "Erro ao instanciar objeto Licenca: " + err.message;
        next(err);
        return;
    }

    // Obtendo conexão
    let conn;
    try {
        conn = await dbo.createConnection();
    } catch (err) {
        next(err);
        return;
    }

    try {
        // salvar no banco
        await conn.query('START TRANSACTION');
        await novaLicenca.save();
        res.json({
            success: true,
            message: "Licença atualizada com sucesso!"
        });

        await conn.query('COMMIT');
    } catch (err) {
        await conn.query('ROLLBACK');
        next(err);
    } finally {
        conn.end();
    }

};

exports.info = async (req, res, next) => {
    Licenca.find({idEmpresa: Number(req.params.idEmpresa)})
        .then( found => {
            res.json({licencaEmpresa: found[0]});
        }).catch( err => {
            next(err);
        });
};
