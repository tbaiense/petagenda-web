const express = require('express');
const router = express.Router({ mergeParams: true });

const pacoteAgendamentoController = require('../controllers/pacoteAgendamentoController');

router.route('/')
.get(pacoteAgendamentoController.list)
.post(pacoteAgendamentoController.create);

router.route('/:idPacoteAgendamento')
.get(pacoteAgendamentoController.info)
// .put(pacoteAgendamentoController.update)
// .delete(pacoteAgendamentoController.delete);

router.route('/:idPacoteAgendamento/estado')
.put(pacoteAgendamentoController.updateEstado);

module.exports = router;
