const express = require('express');
const router = express.Router({ mergeParams: true });

const clienteController = require('../controllers/clienteController');

router.route('/')
.get(clienteController.list)
.post(clienteController.create);

router.route('/:idCliente')
.get(clienteController.info)
.put(clienteController.update)
.delete(clienteController.delete);

module.exports = router;
