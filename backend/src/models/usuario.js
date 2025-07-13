const { dbo } = require('../db');

function Usuario(usuario) {
    const {
        email, senha, perguntaSeguranca
    } = usuario;

    this.email = email;
    this.senha = senha;
    this.perguntaSeguranca = (perguntaSeguranca && perguntaSeguranca == 'object')
                                ? { pergunta: perguntaSeguranca.pergunta, resposta: perguntaSeguranca.resposta }
                                : undefined;

}

exports.setEmpresa = async function (idEmp, idUsr) {

    const conn = await dbo.createConnection();
    await conn.execute(
        `CALL set_empresa_usuario(?, ?)`,
        [idEmp, idUsr]
    ).catch(err => {
        conn?.end();
        throw err;
    });

    conn?.end();
    return;
};

exports.create = async function (usuarioArg) {
    let usuario;

    usuario = new Usuario(usuarioArg);

    const conn = await dbo.createConnection();
    const json = JSON.stringify(usuario);

    const [ results ] = await conn.execute(
        `CALL usuario(?, ?)`,
        ['insert', json]
    ).catch(err => {
        conn?.end();
        throw err;
    });

    conn?.end();
    return;
};

// Encontrar usuário com base em filtros
exports.find = async function (filter = undefined, options = undefined) {
    if (arguments.length == 1) {
        if (!(filter instanceof Object)) {
            throw new TypeError('Filter não é objeto');
        }

        const { email, senha } = filter;

        if (!email || !senha) {
            throw new Error('Informe email e senha para realizar o login');
        }

        // Procurando usuário pelo email e senha
        const conn = await dbo.createConnection();

        let usr;
        let error;
        try {
            const info = await conn.execute(
                'SELECT `id`, `e_admin`, id_empresa FROM `usuario` WHERE `email` = ? AND `senha`= ? LIMIT 1',
                [email, senha]
            );
            if (info[0].length > 0) {
                const [ results ] = info;
                usr = results[0];
            }
        } catch (err) {
            error = new Error('Erro ao realizar busca pelo usuário: ', err.message);
        } finally {
            conn.end();

            if (error) throw error;

            return usr;
        }
    } else {
        throw new Error('Filtro vazio para busca');
    }
}
