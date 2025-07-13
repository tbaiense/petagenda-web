const { IN_PROD } = require('../envLoader');
const { parseJWT, verifyJWT } = require('./jwt');

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!IN_PROD) {
        console.log(`[validateRequestToken] Authorization Header ${authHeader} on ${req.url}\n`);
    }

    try {
        if (!IN_PROD) {
            console.log(`[validateRequestToken] Trying to validate Authorization Header ${authHeader} on ${req.url}\n`);
        }
        if (!req.jwt) {
            throw new Error('cabeçalho "Authorization" não incluído na requisição.');
        }

        verifyJWT(req.jwt);
        next();

        if (!IN_PROD) {
            console.log(`[validateRequestToken] Sucess on validating Authorization Header ${authHeader} on ${req.url}\n`);
        }
    } catch (err) {
        err.message = "Falha ao analisar JWT: " + err.message;
        next(err);

        if (!IN_PROD) {
            console.log(`[validateRequestToken] Error on validating Authorization Header ${authHeader} on ${req.url}: ${err.message}\n`);
        }
    }
};
