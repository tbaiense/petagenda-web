const express = require('express');
const router = express.Router({ mergeParams: true });

const incidenteController = require('../controllers/incidenteController');

router.route('/')
.get(incidenteController.list)
.post(incidenteController.create);

router.route('/:idIncidente')
.get(incidenteController.info)
// .put(incidenteController.update)
// .delete(incidenteController.delete);

module.exports = router;
