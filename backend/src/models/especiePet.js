const { empresa: empresaDB } = require('../db');

/*
 * MODELO DE CLASSE PARA ESPÉCIE DE PET
 *
 * Modelo JSON:
 * {
 *    "id": <INT>,
 *    "idEmpresa": <INT>,
 *    "nome": <VARCHAR(64)>
 * }
 */
class EspeciePet {
    static fromResultSet(rs) {
        const espObj = {
            id: rs.id_especie,
            nome: rs.nome
        };

        return espObj;
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

        const { id, idEmpresa } = filter; // Object representando a especiePet
        const { limit, page, useClass } = options;

        // Buscar no banco espécies
        let espList = [];
        const conn = await empresaDB.createConnection({ id: idEmpresa });

        try {
            if (Number.isInteger(id)) {
                const [ results ] = await conn.execute(
                    `SELECT id AS id_especie, nome FROM especie WHERE id = ? LIMIT 1`,
                    [id]
                );

                if (results.length > 0) {
                    const objEsp = EspeciePet.fromResultSet(results[0]);
                    espList = [ useClass ? new EspeciePet(objEsp) : objEsp ];
                }
            } else { // Buscar várias espécies
                const [ results ] = await conn.execute(
                    `SELECT id AS id_especie, nome FROM especie ORDER BY nome ASC`/* LIMIT ${limit} OFFSET ${limit * page}`*/
                );

                if (results.length > 0) {
                    espList = results.map( esp => {
                        const objEsp = EspeciePet.fromResultSet(esp);

                        return useClass ? new EspeciePet(objEsp) : objEsp;
                    });
                }
            }

            conn.end();
            return espList;
        } catch (err) {
            err.message = "Falha ao buscar registros de espécies de pet: " + err.message;
            conn.end();
            throw err;
        }
    }

    constructor(especiePet) {
        if (typeof especiePet != 'object') {
            throw new TypeError('especiePet argument must be an object containing information for especiePet');
        }

        const {
            id,
            idEmpresa,
            nome
        } = especiePet;

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

module.exports = EspeciePet;
