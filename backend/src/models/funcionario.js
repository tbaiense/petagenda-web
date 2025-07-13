const { empresa: empresaDB } = require('../db');

/*
MODELO DE CLASSE PARA FUNCIONÁRIO

JSON EXEMPLO:
{
    "id": <INT>,   <--- PK de tabela "funcionario",
    "idEmpresa": <INT>
    "nome": <VARCHAR(64)>,   <--- Nome do funcionário
    "telefone": <CHAR(15)>,  <--- Telefone do funcionário no formato "(27) 99900-8181"
    "exerce": ?[ <-- servico-oferecido
        +{
            "servico": <INT>, <-- id de servico oferecido
            "nome": <VARCHAR(64)>
        }
    ]
}
*/

class Funcionario {
    static fromResultSet(rs) {
        let response = {
            id: rs.id_funcionario,
            nome: rs.nome,
            telefone: rs.telefone,
        };

        return response;
    }

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

        const { id, idEmpresa } = filter; // Object representando a Funcionario
        const { limit, page, useClass } = options;

        // Buscar no banco funcionários
        let funcList = [];
        const conn = await empresaDB.createConnection({ id: idEmpresa });

        try {
            if (Number.isInteger(id)) { 
                const [ results ] = await conn.execute(
                    'SELECT `id` AS `id_funcionario`, `nome`, `telefone` FROM `funcionario` WHERE `id` = ? LIMIT 1',
                    [id]
                );
                if (results.length > 0) {
                    const objFunc = Funcionario.fromResultSet(results[0]);
                    funcList = [ useClass ? new Funcionario(objFunc) : objFunc ];
                }
            } else { // Buscar várias Funcionarios
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

                const sql = `SELECT id AS id_funcionario, nome, telefone FROM funcionario ${filterSQL} ${orderSQL} LIMIT ${limit} OFFSET ${limit * page}`
                console.log('sql ', sql);
                console.log(filter, options);
                const [ results ] = await conn.execute(sql);

                if (results.length > 0) {
                    funcList = results.map( emp => {
                        const objFunc = Funcionario.fromResultSet(emp);
    
                        return useClass ? new Funcionario(objFunc) : objFunc;
                    });              
                }
            }
            // anexar servico_exercido ao objeto de resposta
            if (funcList.length > 0) {
                const idList = funcList.map( func => {
                    return func.id;
                });

                const idListStr = idList.join(",");
                const [ servExerc ] = await conn.execute( // NESTE MOMENTO -- APENAS NESTE MOMENTO --, EU AMO JAVASCRIPT <3
                    `SELECT id_funcionario, id_servico_oferecido, nome_servico FROM vw_servico_exercido WHERE id_funcionario IN (${idListStr})`
                );

                servExerc.forEach( res => {
                    const {
                        id_funcionario: idFunc,
                        id_servico_oferecido: id,
                        nome_servico: nome
                    } = res;

                    const index = funcList.findIndex( func => {
                        return func.id === idFunc;
                    });

                    if (!funcList[index].exerce) {
                        funcList[index].exerce = [];
                    }
                    funcList[index].exerce.push({servico: id, nome: nome});
                });
            }
            conn.end();
            return funcList;
        } catch (err) {
            err.message = "Falha ao buscar registros de Funcionario: " + err.message; 
            conn.end();
            throw err;
        }
    }

    constructor (funcionario) {
        if (typeof funcionario != 'object') {
            throw new TypeError('funcionario argument must be an object containing information for Funcionario');
        }

        this.id = funcionario.id;
        this.idEmpresa = funcionario.idEmpresa;
        this.nome = funcionario.nome;
        this.telefone = funcionario.telefone;
        this.exerce = funcionario.exerce;
    }

    async save(connParam = undefined) {
        if (connParam && typeof connParam != 'object') throw new TypeError('connParam parameter must be undefined or a connection object');

        const conn = (connParam) ? connParam : await empresaDB.createConnection({ id: this.idEmpresa });
        // Criar Funcionario
        try {
            const json = JSON.stringify(this);
            let idResponse;
            if (this.isNew) {
                const [ results ] = await conn.execute(
                    'CALL funcionario("insert", ?)',
                    [json]
                );
    
                idResponse = results[0][0].id_funcionario;
                this.id = idResponse;
            } else {
                const [ results ] = await conn.execute(
                    'CALL funcionario("update", ?)',
                    [json]
                );
                idResponse = this.id;
            }

            if (!connParam) conn.end();
            return idResponse;
        } catch (err) {
            if (!connParam) conn.end();
            err.message = "Falha ao cadastrar ou atualizar registro de funcionário: " + err.message;
            throw err;
        }
    }

    #_isNew = true;

    set isNew(isNew) {
        if (typeof isNew != 'boolean') throw new TypeError('value for isNew must be boolean');

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
        if (!Number.isInteger(idEmpresa)) {
            throw new TypeError('idEmpresa must be an integer');
        }

        this.#_idEmpresa = idEmpresa;
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

    #_exerce;

    set exerce(exerce) {
        if (!exerce) {
            this.#_exerce = undefined;
        } else if (exerce instanceof Array) {
            this.#_exerce = exerce.map( serv => {
                if (Number.isInteger(serv.id)) {
                    return { 
                        servico: serv.id, 
                        nome: (typeof serv.nome == 'string' && serv.nome) ? serv.nome : undefined
                    };
                } else {
                    throw new TypeError('exerce contain objects that do not have a valid id value: must be integer');
                }
            });
        } else {
            throw new Error('exerce must be undefined or an array containing Funcionario objects');
        }
    }

    get exerce() {
        return this.#_exerce;
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            telefone: this.telefone,
            exerce: this.exerce
        };
    }

    toString() {

    }
}

module.exports = Funcionario;
