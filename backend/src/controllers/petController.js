const Pet = require('../models/pet');
const { empresa: empresaDB } = require('../db');

exports.create = async (req, res, next) => {
    const {
        dono,
        especie,
        nome,
        sexo,
        porte,
        eCastrado,
        estadoSaude,
        raca,
        cor,
        comportamento,
        cartaoVacina
    } = req.body;

    let novoPet;
    idEmpresa = Number(req.params.idEmpresa);

    try {
        novoPet = {
            idEmpresa,
            dono,
            especie,
            nome,
            sexo,
            porte,
            eCastrado,
            estadoSaude,
            raca,
            cor,
            comportamento,
            cartaoVacina
        };
        novoPet = new Pet(novoPet);
    } catch (err) {
        err.message = "Erro ao instanciar objeto Pet: " + err.message;
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
        const idPet = await novoPet.save(conn);

        res.json({
            success: true,
            message: "Pet cadastrado com sucesso!",

            pet: {
                id: idPet
            }
        });
    } catch (err) {
        next(err);
    } finally {
        conn.end();
    }
};

exports.info = (req, res, next) => {
    Pet.find({ id: Number(req.params.idPet), idEmpresa: Number(req.params.idEmpresa)})
    .then( petFound => {
        if (petFound.length > 1) {
            next(new Error("Condição inesperada: busca por id retornou mais de um resultado"));
            return;
        }

        if (!petFound[0]) res.status(404);

        res.json( { pet: petFound[0] ?? {} });
    })
    .catch( err => {
        next(err);
    });
};

exports.list = (req, res, next) => {
    const idCliente = Number(req.query.idCliente);

    const options = {
        ordenacao: req.query.ordenacao
    };

    const filter = {
        idEmpresa: Number(req.params.idEmpresa),
        idCliente: (idCliente) ? idCliente : Number(req.params.idCliente),
        query: req.query.query,
        option: req.query.option,
        especie: req.query.especie
    };

    Pet.find(filter, options)
    .then( petList => {
        if (petList.length == 0) res.status(404);

        res.json( { pets: petList });
    })
    .catch( err => {
        next(err);
    });};

    exports.update = (req, res, next) => {
        res.send("NOT IMPLEMENTED YET: pet UPDATE");
    };

    exports.delete = (req, res, next) => {
        res.send("NOT IMPLEMENTED YET: pet DELETE");
    };
