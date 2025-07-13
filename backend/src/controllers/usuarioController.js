const usuarioModel = require('../models/usuario');
const { createHmac } = require('node:crypto');
const { generateJWT, parseJWT } = require('../utils/jwt');

const Empresa = require('../models/empresa');

exports.create = async function (req, res, next) {
    let usr;
    try {
        const { email, senha, perguntaSeguranca }  = req.body;

        usr = {
            email: email,
            senha: senha,
            perguntaSeguranca: (typeof perguntaSeguranca == 'object') ? {
                pergunta: perguntaSeguranca.pergunta,
                resposta: perguntaSeguranca.resposta
            } : undefined
        };

        const result = await usuarioModel.create(usr);

        res.json({
            success: true,
            message: "Usuário cadastrado com sucesso!"
        });
    } catch (err) {
        err.message = 'Falha ao realizar cadastro de usuário: ' + err.message;
        next(err);
    }
}

exports.login = async function (req, res, next) {
    const userCredentials = req.body; // json { email: String, senha: String }

    try {
        const usr = await usuarioModel.find(userCredentials)
        if (usr) {
            const jwt = generateJWT(usr);

            const usrInfo = parseJWT(jwt);

            const { user: idUsuario, admin: adminUsuario } = usrInfo.payload;

            const [ empresaUsuario ] = await Empresa.find({ id: usr.id_empresa });

            res.status(200).json({
                success: true,
                message: "Usuário logado com sucesso!",
                token: jwt,
                usuario: {
                    id: idUsuario,
                    admin: adminUsuario
                },
                empresas: (usr.id_empresa != null) ? [{id: usr.id_empresa, licenca: empresaUsuario.licenca?.tipo}] : undefined

            });
        } else { // Usuário inexistente
            res.status(400).json({
                success: false,
                message: "Informações de usuário incorretas ou inexistentes",
            });
        }

    } catch (err) {
        next(err);
    }
}

exports.list = function (req, res) {
    res.send('list work');
}

exports.info = function (req, res) {
    res.send('info work');
}


exports.update = function (req, res) {
    res.send('update work');
}

exports.delete = function (req, res) {
    res.send('delete work');
}

