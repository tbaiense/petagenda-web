const express = require('express');
const router = express.Router({ mergeParams: true });

const servicoOferecidoController = require('../controllers/servicoOferecidoController');
const categoriaServicoOferecidoController = require('../controllers/categoriaServicoOferecidoController');

router.route('/')
    .get(servicoOferecidoController.list)
    .post(servicoOferecidoController.create);

router.get('/categoria', categoriaServicoOferecidoController.list);

router.get('/categoria/:idCategoriaServicoOferecido', categoriaServicoOferecidoController.info);

router.route('/:idServicoOferecido')
    .get(servicoOferecidoController.info)
    .put(servicoOferecidoController.update)
    .delete(servicoOferecidoController.delete);

router.route('/:idServicoOferecido/foto')
    .get(servicoOferecidoController.servico_pic);


module.exports = router;
