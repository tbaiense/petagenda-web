const CategoriaServicoOferecido = require('../models/categoriaServicoOferecido');
const { empresa: empresaDB } = require('../db');

exports.info = (req, res, next) => {
    CategoriaServicoOferecido.find({ id: Number(req.params.idCategoriaServicoOferecido), idEmpresa: Number(req.params.idEmpresa)})
    .then( catFound => {
        if (catFound.length > 1) {
            next(new Error("Condição inesperada: busca por id retornou mais de um resultado"));
            return;
        }

        if (!catFound[0]) res.status(404);

        res.json({ categoriaServicoOferecido: catFound[0] ?? {} });
    })
    .catch( err => {
        next(err);
    });
};


exports.list = (req, res, next) => {

    const filter = {
        idEmpresa: Number(req.params.idEmpresa),
    };

    CategoriaServicoOferecido.find(filter)
    .then( catList => {
        if (catList.length == 0) res.status(404);

        res.json( { categoriasServicoOferecido: [ ...catList ] });
    })
    .catch( err => {
        next(err);
    });

};
