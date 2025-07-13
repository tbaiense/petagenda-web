const fs = require('node:fs/promises');
const path = require('node:path');

const Empresa = require('../models/empresa');
const usuarioModel = require('../models/usuario');
const { dbo } = require('../db');

const { IN_PROD } = require('../envLoader');

// Variáveis de ambiente
const { PROFILE_PIC_DIR } = require('../envLoader');

exports.profile_pic = async function (req, res) {
    const caminhoFoto = path.join(PROFILE_PIC_DIR, `pic_emp_${req.params.idEmpresa}.jpg`);

    try {
        res.setHeader('Content-Type', 'image/jpeg');

        const imgBuffer = await fs.readFile(caminhoFoto);
        res.end(imgBuffer);
    } catch (err) {
        res.status(404).end();
    }
};

exports.list = function (req, res, next) {

    Empresa.find()
        .then( empresaList => {
            if (empresaList.length == 0) res.status(404);

            res.json( { empresas: empresaList });
        })
        .catch( err => {
            next(err);
        });
}

exports.create = async function (req, res, next) {
    // criar objeto empresa

    /*
    foto: {
        type: "image/jpeg",
        data: BASE64
    }

    */
    const { razaoSocial, nomeFantasia, cnpj, lema, foto, endereco } = req.body;

    let novaEmpresa;

    try {
        novaEmpresa = new Empresa({
            razaoSocial,
            nomeFantasia,
            cnpj,
            lema,
            endereco
        });
    } catch (err) {
        err.message = "Erro ao instanciar objeto Empresa: " + err.message;
        next(err);
        return;
    }

    // Obtendo conexão
    let conn;
    try {
        conn = await dbo.createConnection();
    } catch (err) {
        next(err);
        return;
    }

    try {
        // salvar no banco
        await conn.query('START TRANSACTION');
        const idEmpresa = await novaEmpresa.save(conn);
    
        // Cadastrar foto
        if (foto && typeof foto == 'object') {
            if (foto.data && typeof foto.data == 'string') {
                let linkFoto = path.join(PROFILE_PIC_DIR, `pic_emp_${idEmpresa}.jpg`);
                let handle;
                try {
                    handle = await fs.open(linkFoto, 'w');
                    await handle.writeFile(foto.data, { encoding: 'base64' });
                    handle?.close();
                    handle = null;
                    // atualizar usuário com link da foto
                    novaEmpresa.foto = `/empresa/${idEmpresa}/pic_emp_${idEmpresa}.jpg`;
    
                    await novaEmpresa.save();
                } catch (errFoto) {
                    if (handle != null) handle?.close();
                    //console.log('erro ao cadastrar foto: ', err.message);
                    errFoto.message = 'Falha ao cadastrar foto: ' + errFoto.message;
                    throw errFoto;
                }
            }
        }
    
        // Se está utilizando token
        if (req.jwt) {
            // associar registro da empresa ao usuário
            usuarioModel.setEmpresa(idEmpresa, Number(req.jwt.payload.user))
                .then(() => {
                    res.json({
                        success: true,
                        message: "Empresa cadastrada com sucesso!",

                        empresa: {
                            id: idEmpresa
                        }
                    });
                })
                .catch( err => {
                    next(err);
                });
        } else {
            res.send();
        }
    
        await conn.query('COMMIT');
    } catch (err) {
        await conn.query('ROLLBACK');
        next(err);
    } finally {
        conn.end();
    }
}
exports.info = function (req, res, next) {
    Empresa.find({id: Number(req.params.idEmpresa)})
        .then( found => {
            // console.log('rodei');
            res.json({empresa: (found[0]) ? found[0] : {}});
        }).catch( err => {
            next(err);
        });
}
exports.update = async function (req, res, next) {
    // atualizar objeto empresa

    /*
     foto: {
        type: "image/jpeg",
        data: BASE64
    }

*/
    const { razaoSocial, nomeFantasia, cnpj, lema, foto, endereco } = req.body;
    const id = +req.params.idEmpresa;
    let empresaEditada;

    try {
        empresaEditada = new Empresa({
            id,
            razaoSocial,
            nomeFantasia,
            cnpj,
            lema,
            endereco
        });
    } catch (err) {
        err.message = "Erro ao instanciar objeto Empresa: " + err.message;
        next(err);
        return;
    }

    // Obtendo conexão
    let conn;
    try {
        conn = await dbo.createConnection();
    } catch (err) {
        next(err);
        return;
    }

    try {
        // salvar no banco
        await conn.query('START TRANSACTION');
        const idEmpresa = await empresaEditada.save(conn);

        // Cadastrar foto
        if (foto && typeof foto == 'object') {
            if (foto.data && typeof foto.data == 'string') {
                let linkFoto = path.join(PROFILE_PIC_DIR, `pic_emp_${idEmpresa}.jpg`);
                let handle;
                try {
                    handle = await fs.open(linkFoto, 'w');
                    await handle.writeFile(foto.data, { encoding: 'base64' });
                    handle?.close();
                    handle = null;
                    // atualizar usuário com link da foto
                    empresaEditada.foto = `/empresa/${idEmpresa}/pic_emp_${idEmpresa}.jpg`;

                    await empresaEditada.save();
                } catch (errFoto) {
                    if (handle != null) handle?.close();
                    //console.log('erro ao cadastrar foto: ', err.message);
                    errFoto.message = 'Falha ao atualizar foto: ' + errFoto.message;
                    throw errFoto;
                }
            }
        }


        res.json({
            success: true,
            message: "Empresa atualizada com sucesso!",

            empresa: {
                id: idEmpresa
            }
        });

        await conn.query('COMMIT');
    } catch (err) {
        await conn.query('ROLLBACK');
        next(err);
    } finally {
        conn.end();
    }
}
exports.delete = function (req, res) {
    res.send('empresa delete work');
}
