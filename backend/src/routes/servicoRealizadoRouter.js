const express = require('express');
const router = express.Router({ mergeParams: true });

const servicoRealizadoController = require('../controllers/servicoRealizadoController');

router.route('/')
.get(servicoRealizadoController.list)
.post(servicoRealizadoController.create);

router.route('/:idServicoRealizado')
.get(servicoRealizadoController.info)
.put(servicoRealizadoController.update)
// .delete(servicoRealizadoController.delete);

module.exports = router;
