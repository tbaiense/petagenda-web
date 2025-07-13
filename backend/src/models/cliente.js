const { empresa: empresaDB } = require('../db');

/*
MODELO DE CLASSE PARA CLIENTE

JSON:
{
    "id": <INT>,
    "idEmpresa": <INT>,
    "nome": <VARCHAR(64)>,
    "telefone": <CHAR(15)>,
    "servicoRequerido": ?[
        +{ "servico": <INT>, "nome": <VARCHAR(64)> }
    ],
    "endereco": {
        "logradouro": <VARCHAR(128)>,
        "numero": <VARCHAR(16)> ,
        "bairro": <VARCHAR(64)>,
        "cidade": <VARCHAR(64)>,
        "estado": <CHAR(2)>     <-- Sigla da unidade federativa (ex: "DF", "ES")
    }
}
*/

class Cliente {

    static fromResultSet(rs) {
        const objCliente = {
            id: rs.id_cliente,
            nome: rs.nome,
            telefone: rs.telefone,
            endereco: (rs.logradouro_end) ?
                {
                    logradouro: rs.logradouro_end,
                    numero: rs.numero_end,
                    bairro: rs.bairro_end,
                    cidade: rs.cidade_end,
                    estado: rs.estado_end
                }
                : undefined
        };

        return objCliente;
    }

    // TODO: finalizar
    static async find(filter, options) {
        if (filter && !(filter instanceof Object)) {
            throw new TypeError('Filter deve ser Object');
        }

        if (options && !(options instanceof Object)) {
            throw new TypeError('Options deve ser Object');
        }

        if (!filter || typeof filter != 'object' || !Number.isInteger(filter.idEmpresa)) {
            throw new Error('filter parameter must be an object and contain at least idEmpresa that is an integer');
        }

        if (!Number.isInteger(filter.id)) {
            filter.id = undefined;
        }

        if (!options) {
            options = {};
        }

        if (!Number.isInteger(options.limit)) {
            options.limit = 1000;
        }

        if (!Number.isInteger(options.page)) {
            options.page = 0;
        }

        if (typeof options.useClass != 'boolean') {
            options.useClass = false;
        }

        const { id, idEmpresa } = filter; // Object representando a Cliente
        const { limit, page, useClass } = options;

        // Buscar no banco clientes
        let cliList = [];
        const conn = await empresaDB.createConnection({ id: idEmpresa });

        try {
            if (Number.isInteger(id)) {
                const [ results ] = await conn.execute(
                    'SELECT * FROM `vw_cliente` WHERE `id_cliente` = ? LIMIT 1',
                    [id]
                );
                if (results.length > 0) {
                    const objCli = Cliente.fromResultSet(results[0]);
                    cliList = [ useClass ? new Cliente(objCli) : objCli ];
                }
            } else { // Buscar várias Clientes
                let orderSQL = '';
                let filterSQL = '';

                if (filter.option) {
                    switch(filter.option) {
                        case 'nome': {
                            filterSQL += `WHERE nome LIKE '${filter.query}%' OR nome LIKE '%${filter.query}%' `;

                            if (options.ordenacao) {
                                orderSQL += `ORDER BY nome ${(options.ordenacao != 'ascending') ? 'DESC' : 'ASC'}`;
                            }

                            break;
                        }
                        default: {}
                    }
                } else {
                    filterSQL = '';
                }

                const sql = `SELECT * FROM vw_cliente ${filterSQL} ${orderSQL} LIMIT ${limit} OFFSET ${limit * page}`

                const [ results ] = await conn.execute(sql);

                if (results.length > 0) {
                    cliList = results.map( cli => {
                        const objCli = Cliente.fromResultSet(cli);

                        return useClass ? new Cliente(objCli) : objCli;
                    });
                }
            }
            // anexar servico_requerido ao objeto de resposta
            if (cliList.length > 0) {
                const idList = cliList.map( cli => {
                    return cli.id;
                });

                const idListStr = idList.join(",");
                const [ servReq ] = await conn.execute( // NESTE MOMENTO -- APENAS NESTE MOMENTO --, EU AMO JAVASCRIPT <3
                `SELECT id_cliente, id_servico_requerido, nome_servico FROM vw_servico_requerido WHERE id_cliente IN (${idListStr})`
                );

                servReq.forEach( res => {
                    const {
                        id_cliente: idCli,
                        id_servico_requerido: id,
                        nome_servico: nome
                    } = res;

                    const index = cliList.findIndex( cli => {
                        return cli.id === idCli;
                    });

                    if (!cliList[index].servicoRequerido) {
                        cliList[index].servicoRequerido = [];
                    }
                    cliList[index].servicoRequerido.push({servico: id, nome: nome});
                });
            }
            conn.end();
            return cliList;
        } catch (err) {
            err.message = "Falha ao buscar registros de Cliente: " + err.message;
            conn.end();
            throw err;
        }
    }

    #_isNew = true;

    set isNew(isNew) {
        if (typeof isNew != 'boolean') {
            throw new TypeError('isNew value must be boolean');
        }

        this.#_isNew = isNew;
    }

    get isNew() {
        return this.#_isNew;
    }

    #_id;

    set id(id) {
        if (Number.isInteger(id)) {
            this.#_id = id;

            if (this.isNew) {
                this.isNew = false;
            }

        } else if (id == null || id == undefined) {
            this.#_id = undefined;
            this.isNew = true;
        } else {
            throw new TypeError('id must be an integer or null or undefined');
        }
    }

    get id() {
        return this.#_id;
    }

    #_idEmpresa;

    set idEmpresa(idEmpresa) {
        if (Number.isInteger(idEmpresa)) {
            this.#_idEmpresa = idEmpresa;
        } else {
            this.#_idEmpresa = undefined;
        }
    }

    get idEmpresa() {
        return this.#_idEmpresa;
    }

    #_nome;

    set nome(nome) {
        if (typeof nome != 'string' || nome.length < 3) throw new TypeError('nome value must be a string with at least 3 characters');
        // TODO: validar string de nome
        this.#_nome = nome;
    }

    get nome() {
        return this.#_nome;
    }

    #_telefone;

    set telefone(telefone) {
        if (typeof telefone != 'string' || telefone.length < 9) throw new TypeError('telefone value must be a string with at least 3 characters');
        // TODO: validar string de telefone
        this.#_telefone = telefone;
    }

    get telefone() {
        return this.#_telefone;
    }

    #_servicoRequerido;

    set servicoRequerido(servicoRequerido) {
        if (!servicoRequerido) {
            this.#_servicoRequerido = undefined;
        } else if (servicoRequerido instanceof Array) {
            this.#_servicoRequerido = servicoRequerido.map( serv => {
                if (Number.isInteger(serv.servico)) {
                    return {
                        servico: serv.servico,
                        nome: (typeof serv.nome == 'string' && serv.nome) ? serv.nome : undefined
                    };
                } else {
                    throw new TypeError('servicoRequerido contain one or more objects that do not have a valid id value: must be integer');
                }
            });
        } else {
            throw new Error('servicoRequerido must be undefined or an array containing ServicoOferecido objects');
        }
    }

    get servicoRequerido() {
        return this.#_servicoRequerido;
    }

    #_endereco;

    set endereco(endereco) {
        if (!endereco) {
            throw new TypeError('endereco parameter must be an object, cannot be null or undefined');
        } else if (typeof endereco == 'object' && !(endereco instanceof Array)) {
                if (endereco.logradouro && endereco.numero && endereco.bairro && endereco.cidade && endereco.estado) {
                    this.#_endereco = {
                        logradouro: endereco.logradouro,
                        numero: endereco.numero,
                        bairro: endereco.bairro,
                        cidade: endereco.cidade,
                        estado: endereco.estado
                    };
                } else {
                    throw new TypeError('endereco object is missing one or more required properties: logradouro, numero, bairro, cidade or estado');
                }
        } else {
            throw new Error('endereco must be undefined or contain an Endereco object');
        }
    }

    get endereco() {
        return this.#_endereco;
    }

    constructor(cliente) {
        if (!cliente || typeof cliente != 'object' || cliente instanceof Array) {
            throw new TypeError('cliente parameter must be an object containing Cliente properties');
        }

        const {
            id,
            idEmpresa,
            nome,
            telefone,
            endereco,
            servicoRequerido
        } = cliente;

        this.id = id;
        this.idEmpresa = idEmpresa;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.servicoRequerido = servicoRequerido;
    }

    async save(connParam) {
        if (connParam && typeof connParam != 'object') throw new TypeError('connParam parameter must be undefined or a connection object');
        const conn = (connParam) ? connParam : await empresaDB.createConnection({ id: this.idEmpresa });
        // Criar Cliente
        try {
            const json = JSON.stringify(this);

            let idResponse;
            if (this.isNew) {
                const [ results ] = await conn.execute(
                    'CALL cliente("insert", ?)',
                    [json]
                );

                idResponse = results[0][0].id_cliente;
                this.id = idResponse;
            } else {
                const [ results ] = await conn.execute(
                    'CALL cliente("update", ?)',
                    [json]
                );
                idResponse = this.id;
            }

            if (!connParam) conn.end();
            return idResponse;
        } catch (err) {
            if (!connParam) conn.end();
            err.message = "Falha ao cadastrar ou atualizar registro de cliente: " + err.message;
            throw err;
        }
    }


    toJSON() {
        const  objJson = {
            id: this.id,
            nome: this.nome,
            telefone: this.telefone,
            endereco: this.endereco,
            servicoRequerido: (this.servicoRequerido) ? this.servicoRequerido : undefined
        };

        return objJson;
    }

    toString() {}

}

module.exports = Cliente;
