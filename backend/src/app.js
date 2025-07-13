const express = require('express');
const router = require('./router');
const db = require('./db');

const setHeaders = require('./utils/setHeaders');
const { getJWT } = require('./utils/jwt');

const { BIND_ADDRESS, BIND_PORT } = require('./envLoader');

const app = express();

// Utils middleware
// app.set('query parser', 'extended');
app.use(setHeaders);
app.use(getJWT);

// Route handling

app.use(router);

// Error handlers

app.use((err, req, res, next) => {
    console.error(err);
    next(err);
});

app.use((err, req, res, next) => {
    console.log(`[PetAgenda - Backend] Erro ao realizar operação (${req.METHOD} ${req.url}):`, err.message, '\n');
    res.status(400).json({
        success: false,
        message: "Falha ao realizar a operação",
        errors: [
            err.message
        ]
    });
});

app.listen(+BIND_PORT, BIND_ADDRESS, function () {
    console.log(`[PetAgenda - Backend] Servidor iniciado!\n>>> URL http://${BIND_ADDRESS}:${+BIND_PORT}/`);
});

module.exports = app;
