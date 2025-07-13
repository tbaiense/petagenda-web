const express = require('express');
const router = express.Router({ mergeParams: true });

const relatorioController = require('../controllers/relatorioController');

router.get('/simples/financeiro', relatorioController.simplesFinanceiro);

router.get('/detalhado/servico-oferecido', relatorioController.detalhadoServicoOferecido);

module.exports = router;


