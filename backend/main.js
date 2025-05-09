/*
Script de entry-point para o servidor de back-end para o PetAgenda.
=========================================================================
Versão: 0.0.1
Data: 28/04/2025
Descrição:
    Define as configurações do servidor HTTP.
=========================================================================
*/
import http from 'node:http';
import router from './router.js';

const PORT = 3000;
const ADDRESS = 'localhost';

const app = http.createServer((req, res) => {
    try {
        router(req, res);
    } catch (err) {
        console.error(err.message);
        res.statusCode = 500;
        res.end();
    }
});

app.listen(PORT, ADDRESS);