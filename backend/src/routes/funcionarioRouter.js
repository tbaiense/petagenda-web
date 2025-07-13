const express = require('express');
const router = express.Router({ mergeParams: true });

const funcionarioController = require('../controllers/funcionarioController');

router.route('/')
    .get(funcionarioController.list)
    .post(funcionarioController.create);

router.route('/:idFuncionario')
    .get(funcionarioController.info)
    .put(funcionarioController.update)
    .delete(funcionarioController.delete);

module.exports = router;