const { IN_PROD } = require('../envLoader');

module.exports = (req, res, next) => {
    if (!IN_PROD) {
        console.log(`[Router] Received ${req.method} on ${req.url}\n`);
    }
    next();
}
