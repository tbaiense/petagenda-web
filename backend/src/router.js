const express = require('express');
const router = express.Router();

const usuarioRouter = require('./routes/usuarioRouter');
const empresaRouter = require('./routes/empresaRouter');
const authRouter = require('./routes/authRouter');

const validateRequestToken = require('./utils/validateRequestToken');
const routerLogger = require('./utils/routerLogger');

router.use(routerLogger);

router.use('/usuario', usuarioRouter);
router.use('/auth', authRouter);

router.route('*')
    .get(validateRequestToken)
    .post(validateRequestToken)
    .put(validateRequestToken)
    .delete(validateRequestToken);

router.use('/empresa', empresaRouter);

module.exports = router;
