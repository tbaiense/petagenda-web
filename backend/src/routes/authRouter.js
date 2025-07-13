const express = require('express');
const router = express.Router();

const { createHmac } = require('node:crypto');
const { getJWT } = require('../utils/jwt');
const validateRequestToken = require('../utils/validateRequestToken');

router.post('/verify-token', getJWT, validateRequestToken, (req, res, next) => {
    try {
        const jwt = req.jwt;

        res.json({
            success: true,
            message: 'JWT aceito',
            user: jwt.payload.user,
            admin: jwt.payload.admin
        });
    } catch (err) {
        err.message = 'Falha ao analisar JWT: ' + err.message;
        next(err);
    }
});

router.use((err, req, res, next) => {
    res.status(400).json({
        success: false,
        message: err.msg
    });
});

module.exports = router;
