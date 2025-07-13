const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const empresaController = require('../controllers/empresaController');
const licencaController = require('../controllers/licencaController');

const relatorioRouter = require('./relatorioRouter');
const servicoOferecidoRouter = require('./servicoOferecidoRouter');
const funcionarioRouter = require('./funcionarioRouter');
const clienteRouter = require('./clienteRouter');
const petRouter = require('./petRouter');
const agendamentoRouter = require('./agendamentoRouter');
const servicoRealizadoRouter = require('./servicoRealizadoRouter');
const incidenteRouter = require('./incidenteRouter');
const pacoteAgendamentoRouter = require('./pacoteAgendamentoRouter');

const { IN_PROD } = require('../envLoader');


router.use((req, res, next) => {
    if (!IN_PROD) {
        console.log(`[empresaRouter] Received ${req.method} on ${req.url}`);
    }
    next();
});

router.use(bodyParser.json({limit: '5mb'}));

router.route('/')
    .get(empresaController.list)
    .post(empresaController.create);

router.route('/:idEmpresa')
    .get(empresaController.info)
    .put(empresaController.update)
    .delete(empresaController.delete);

router.route('/:idEmpresa/foto-perfil')
    .get(empresaController.profile_pic);

router.route('/:idEmpresa/licenca')
    .get(licencaController.info)
    .post(licencaController.set)
    .put(licencaController.set);


router.use('/:idEmpresa/relatorio', relatorioRouter);
router.use('/:idEmpresa/servico-oferecido', servicoOferecidoRouter);
router.use('/:idEmpresa/funcionario', funcionarioRouter);
router.use('/:idEmpresa/cliente', clienteRouter);
router.use('/:idEmpresa/pet', petRouter);
router.use('/:idEmpresa/agendamento', agendamentoRouter);
router.use('/:idEmpresa/servico-realizado', servicoRealizadoRouter);
router.use('/:idEmpresa/incidente', incidenteRouter);
router.use('/:idEmpresa/pacote-agendamento', pacoteAgendamentoRouter);

module.exports = router;
