const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const usuarioController = require('../controllers/usuarioController');

router.use(bodyParser.json());

router.route('/')
    .get(usuarioController.list)
    .post(usuarioController.create);

router.post('/login', usuarioController.login);

router.route('/:idUsuario')
    .get(usuarioController.info)
    .put(usuarioController.update)
    .delete(usuarioController.delete);

module.exports = router;
