const { createHmac } = require('node:crypto');
const { HMAC_SECRET } = require('../envLoader');
const { IN_PROD } = require('../envLoader');

const generateJWT = function(usuario) {
    if (!usuario || typeof usuario != 'object') {
        throw new TypeError("Usuário deve ser um objeto para geração de JWT");
    }

    const { id, e_admin } = usuario;

    const header = Buffer.from(JSON.stringify({
        alg: "HS256",
        typ: "JWT"
    }))
    .toString('base64url');

    const payload = Buffer.from(JSON.stringify({
        iss: "petagenda-backend",
        exp: Math.floor(Date.now() / 1000 * 60 * 60 * 3), // Dois minutos no futuro
        user: id,
        admin: (e_admin == 'Y') ? true : false
    }))
    .toString('base64url');


    const hash = createHmac('sha256', HMAC_SECRET);
    hash.update(header + "." + payload);
    const signature = hash.digest('base64url');

    const jwt = `${header}.${payload}.${signature}`;

    return jwt;
};

const parseJWT = function (encoded) {
    // Verificando signature
    const parts = encoded.split('.');
    if (parts.length != 3) {
        throw Error("JWT mal-formatado");
    }
    const [ header, payload, signature ] = parts;

    const headerObj = JSON.parse(Buffer.from(header, 'base64url').toString());
    const payloadObj = JSON.parse(Buffer.from(payload, 'base64url').toString());

    if (headerObj.alg !== 'HS256') {
        next(new Error('Algoritmo de hash inválido'));
        return;
    }

    const jwt = {
        encoded: encoded,
        header: {
            encoded: header,
            ...headerObj
        },
        payload: {
            encoded: payload,
            ...payloadObj
        },
        signature: signature
    };

    return jwt;
};

const verifyJWT = function (jwt) {
    const hmac = createHmac('sha256', HMAC_SECRET);
    hmac.update(jwt.header.encoded + "." + jwt.payload.encoded);
    const digest = hmac.digest('base64url');
    // console.log(jwt);
    // console.log('digest: ', digest, '  signature ', jwt.signature);
    if (digest !== jwt.signature) {
        throw new Error('a signature contida no token é diferente da computada');
    }

    if (jwt.payload.exp <= Math.floor(Date.now() / 1000)) {
        throw new Error('o token foi expirado');
    }
};

const getJWT = function (req, res, next) {
    try {
        const authHeader = req.headers["authorization"];

        if (!IN_PROD) {
            console.log(`[jwt] Authorization Header ${authHeader} on ${req.url}\n`);
        }

        if (authHeader && authHeader.trim()) {
            const encoded = authHeader.replace("Bearer", '').trim();
            const jwt = parseJWT(encoded);
            req.jwt = jwt;
        } else {
            req.jwt = undefined;
        }
        next();
    } catch (err) {
        err.message = "Falha ao analisar JWT: " + err.message;
        next(err);
    }
}

module.exports = {
    generateJWT,
    parseJWT,
    verifyJWT,
    getJWT
};
