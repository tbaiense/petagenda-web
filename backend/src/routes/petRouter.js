const express = require('express');
const router = express.Router({ mergeParams: true });

const petController = require('../controllers/petController');
const especiePetController = require('../controllers/especiePetController');

router.route('/')
.get(petController.list)
.post(petController.create);

router.get('/especie', especiePetController.list);
router.get('/especie/:idEspeciePet', especiePetController.info);

router.route('/:idPet')
.get(petController.info)
.put(petController.update)
.delete(petController.delete);

module.exports = router;
