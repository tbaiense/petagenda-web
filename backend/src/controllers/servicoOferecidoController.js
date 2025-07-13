const ServicoOferecido = require('../models/servicoOferecido');
const fs = require('node:fs/promises');
const path = require('node:path');

// Variáveis de ambiente
const { SERVICO_PIC_DIR } = require('../envLoader');


// TODO: TESTAR!!
exports.servico_pic = async function (req, res, next) {
    const caminhoFoto = path.join(SERVICO_PIC_DIR, `pic_serv_${req.params.idServicoOferecido}_emp_${req.params.idEmpresa}.jpg`);

    try {
        res.setHeader('Content-Type', 'image/jpeg');

        const imgBuffer = await fs.readFile(caminhoFoto);
        res.end(imgBuffer);
    } catch (err) {
        res.status(404).end();
    }
};

exports.create = async (req, res, next) => {
    const idEmpresa =  Number(req.params.idEmpresa);
    const { 
        nome,
        categoria,
        nomeCategoria,
        preco,
        tipoPreco,
        descricao,
        foto,
        restricaoParticipante,
        restricaoEspecie,
    } = req.body;
    
    let novoServico;
    try {
        novoServico = {
            idEmpresa,
            nome,
            categoria,
            nomeCategoria,
            preco,
            tipoPreco,
            descricao,
            foto,
            restricaoParticipante,
            restricaoEspecie,
        };

        novoServico = new ServicoOferecido(novoServico);
    } catch (err) {
        err.message = "Erro ao instanciar objeto ServicoOferecido: " + err.message;
        next(err);
        return;
    }

    // salvar no banco
    let idServicoOferecido
    try {
        idServicoOferecido = await novoServico.save();
    } catch (err) {
        next(err);
        return;
    }
    
    // Cadastrar foto
    // TODO: TESTAR!!
    if (foto && typeof foto == 'object') {
        if (foto.data && typeof foto.data == 'string') {
            let linkFoto = path.join(SERVICO_PIC_DIR, `pic_serv_${idServicoOferecido}_emp_${idEmpresa}.jpg`);
            let handle;
            try {
                handle = await fs.open(linkFoto, 'w');
                await handle.writeFile(foto.data, { encoding: 'base64' });

                // atualizar usuário com link da foto
                novaEmpresa.foto = `/empresa/${idEmpresa}/servico-oferecido/${idServicoOferecido}/foto`;

                await novaEmpresa.save();
            } catch (err) {
                err.message = "Erro ao cadastrar foto de serviço oferecido: " + err.message;
            } finally {
                handle?.close();
            }

        }
    }
    
    res.json({
        success: true,
        message: "Serviço oferecido cadastrado com sucesso!",

        servicoOferecido: {
            id: idServicoOferecido
        }
    });
};

exports.list = function (req, res, next) {
    let options;

    if (Number.isInteger(+req.query.limit) && Number.isInteger(+req.query.page)) {
        options = {
            limit: +req.query.limit,
            page: +req.query.page
        };
    }
    ServicoOferecido.find({ idEmpresa: Number(req.params.idEmpresa)}, options)
        .then( ({ qtdServicosOferecidos, servicoList }) => {
            if (servicoList.length == 0) res.status(404);

            res.json( { qtdServicosOferecidos: qtdServicosOferecidos ,servicosOferecidos: servicoList });
        })
        .catch( err => {
            next(err);
        });
}


exports.info = function (req, res, next) {
    ServicoOferecido.find({ id: Number(req.params.idServicoOferecido), idEmpresa: Number(req.params.idEmpresa)})
        .then( ({ servicoList: servicoFound }) => {
            if (servicoFound.length > 1) {
                next(new Error("Condição inesperada: busca por id retornou mais de um resultado"));
                return;
            }

            if (!servicoFound[0]) res.status(404);

            res.json( { servicoOferecido: servicoFound[0] ?? {} });
        })
        .catch( err => {
            next(err);
        });
}


exports.update = function (req, res) {
    res.send('update work');
}

exports.delete = function (req, res) {
    res.send('delete work');
}
