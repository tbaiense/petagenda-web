const EspeciePet = require('../models/especiePet');
const { empresa: empresaDB } = require('../db');

exports.info = (req, res, next) => {
    EspeciePet.find({ id: Number(req.params.idEspeciePet), idEmpresa: Number(req.params.idEmpresa)})
    .then( espFound => {
        if (espFound.length > 1) {
            next(new Error("Condição inesperada: busca por id retornou mais de um resultado"));
            return;
        }

        if (!espFound[0]) res.status(404);

        res.json({ especiePet: espFound[0] ?? {} });
    })
    .catch( err => {
        next(err);
    });
};


exports.list = (req, res, next) => {

    const filter = {
        idEmpresa: Number(req.params.idEmpresa),
    };

    EspeciePet.find(filter)
    .then( espList => {
        if (espList.length == 0) res.status(404);

        res.json( { especiesPet: [ ...espList ] });
    })
    .catch( err => {
        next(err);
    });

};
