const { empresa: empresaDB } = require('../db');

/*
 * MODELO DE CLASSE PARA CATEGORIA DE SERVIÇO OFERECIDO
 *
 * Modelo JSON:
 * {
 *    "id": <INT>,
 *    "idEmpresa": <INT>,
 *    "nome": <VARCHAR(64)>
 * }
 */
class CategoriaServicoOferecido {
    static fromResultSet(rs) {
        const catObj = {
            id: rs.id_categoria_servico_oferecido,
            nome: rs.nome
        };

        return catObj;
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

        if (!options || (!Number.isInteger(options.limit) || !Number.isInteger(options.page))) {
            options = { limit: 10, page: 0, useClass: false };
        }

        const { id, idEmpresa } = filter; // Object representando a categoriaServicoOferecido
        const { limit, page, useClass } = options;

        // Buscar no banco categorias de servicos oferecidos
        let catList = [];
        const conn = await empresaDB.createConnection({ id: idEmpresa });

        try {
            if (Number.isInteger(id)) {
                const [ results ] = await conn.execute(
                    `SELECT id AS id_categoria_servico_oferecido, nome FROM categoria_servico WHERE id = ? LIMIT 1`,
                    [id]
                );

                if (results.length > 0) {
                    const objCat = CategoriaServicoOferecido.fromResultSet(results[0]);
                    catList = [ useClass ? new CategoriaServicoOferecido(objCat) : objCat ];
                }
            } else { // Buscar várias CategoriaServicoOferecidos
                const [ results ] = await conn.execute(
                    `SELECT id AS id_categoria_servico_oferecido, nome FROM categoria_servico ORDER BY nome ASC LIMIT ${limit} OFFSET ${limit * page}`
                );

                if (results.length > 0) {
                    catList = results.map( cat => {
                        const objCat = CategoriaServicoOferecido.fromResultSet(cat);

                        return useClass ? new CategoriaServicoOferecido(objCat) : objCat;
                    });
                }
            }

            conn.end();
            return catList;
        } catch (err) {
            err.message = "Falha ao buscar registros de CategoriaServicoOferecido: " + err.message;
            conn.end();
            throw err;
        }
    }

    constructor(categoriaServicoOferecido) {
        if (typeof categoriaServicoOferecido != 'object') {
            throw new TypeError('categoriaServicoOferecido argument must be an object containing information for categoriaServicoOferecido');
        }

        const {
            id,
            idEmpresa,
            nome
        } = categoriaServicoOferecido;

        this.id = id;
        this.idEmpresa = idEmpresa;
        this.nome = nome;
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


    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
        };
    }
}

module.exports = CategoriaServicoOferecido;
