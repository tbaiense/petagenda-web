const { empresa: empresaDB } = require('../db');

/*
 * MODELO DE CLASSE PARA PET
 *
 * JSON:
 * {
        "id": <INT>, <--- id do pet
        "idEmpresa": <INT>,
        "dono": {
            "id": <INT>,   <--- id do dono do pet (PK da tabela "pet")
            "nome": <VARCHAR>
        },
        "especie": {
            "id": <INT>, <--- id da espécie do pet (PK da tabela "especie")
            "nome": <VARCHAR>
        },
        "nome": <VARCHAR(64)>,
        "sexo": <ENUM("M", "F")>,
        "porte": <ENUM("P", "M", "G")>,
        "eCastrado": boolean,   <-- situação de castração do pet
        "estadoSaude": <VARCHAR(32)>,
        "raca": ?<VARCHAR(64)>,
        "cor": ?<VARCHAR(32)>,
        "comportamento": ?<VARCHAR(64)>,    <-- descrição do comportamento
        "cartaoVacina": ?<TEXT>,   <--- caminho para o cartão de vacina no sistema de arquivos ("/caminho/cartao_vacina.pdf")
 * }
 */

class Pet {

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

    #_dono;

    set dono(dono) {
        if (dono) {
            if (typeof dono !== 'object') throw new TypeError('Informações de dono devem ser Object');

            this.#_dono = {
                id: dono.id,
                nome: dono.nome
            };

        } else {
            throw new TypeError('Objeto de dono do pet não pode ser nulo');
        }
    }

    get dono() {
        return this.#_dono;
    }

    #_especie;

    set especie(especie) {
        if (especie) {
            if (typeof especie !== 'object') throw new TypeError('Informações de espécie devem ser Object');

            this.#_especie = {
                id: especie.id,
                nome: especie.nome
            };

        } else {
            throw new TypeError('Objeto de espécie do pet não pode ser nulo');
        }
    }

    get especie() {
        return this.#_especie;
    }

    #_nome;

    set nome(nome) {
        if (typeof nome != 'string' || nome.length < 2) throw new TypeError('nome value must be a string with at least 3 characters');
        // TODO: validar string de nome
        this.#_nome = nome;
    }

    get nome() {
        return this.#_nome;
    }

    #_sexo;

    set sexo(sexo) {
        if (typeof sexo != 'string' || sexo.length != 1) throw new TypeError('nome value must be a string: M or F');
        switch (sexo) {
            case  'M':
            case  'F': {
                this.#_sexo = sexo;
                break;
            }
            default: {
                throw new Error('sexo deve ser "M" ou "F"');
            }
        }
    }

    get sexo() {
        return this.#_sexo;
    }

    #_porte;

    set porte(porte) {
        if (typeof porte != 'string' || porte.length != 1) throw new TypeError('porte value must be a string: M or F');
        switch (porte) {
            case 'P':
            case 'M':
            case 'G': {
                this.#_porte = porte;
                break;
            }
            default: {
                throw new Error('porte deve ser "P", "M" ou "G"');
            }
        }
    }

    get porte() {
        return this.#_porte;
    }

    get sexo() {
        return this.#_sexo;
    }

    #_eCastrado;

    set eCastrado(eCastrado) {
        if (typeof eCastrado != 'boolean') {
            throw new TypeError('eCastrado deve ser boolean');
        }

        this.#_eCastrado = eCastrado;
    }

    get eCastrado() {
        return this.#_eCastrado;
    }

    #_estadoSaude;

    set estadoSaude(estadoSaude) {
        if (typeof estadoSaude != 'string' || estadoSaude.length < 3) throw new TypeError('estadoSaude value must be a string with at least 3 characters');
        // TODO: validar string de nome
        this.#_estadoSaude = estadoSaude;
    }

    get estadoSaude() {
        return this.#_estadoSaude;
    }

    #_raca;

    set raca(raca) {
        if (!raca) {
            this.#_raca = undefined;
            return;
        }

        if (typeof raca == 'string') {
            // TODO: validar string de nome
            this.#_raca = raca;
        } else {
            throw new TypeError('Valor inválido para raça de pet: deve ser string ou undefined');
        }
    }

    get raca() {
        return this.#_raca;
    }

    #_cor;

    set cor(cor) {
        if (!cor) {
            this.#_cor = undefined;
            return;
        }

        if (typeof cor == 'string') {
            // TODO: validar string de nome
            this.#_cor = cor;
        } else {
            throw new TypeError('Valor inválido para raça de pet: deve ser string ou undefined');
        }
    }

    get cor() {
        return this.#_cor;
    }

    #_comportamento;

    set comportamento(comportamento) {
        if (!comportamento) {
            this.#_comportamento = undefined;
            return;
        }

        if (typeof comportamento == 'string') {
            // TODO: validar string de comportamento
            this.#_comportamento = comportamento;
        } else {
            throw new TypeError('Valor inválido para comportamento de pet: deve ser string ou undefined');
        }
    }

    get comportamento() {
        return this.#_comportamento;
    }

    #_cartaoVacina;

    set cartaoVacina(cartaoVacina) {
        if (!cartaoVacina) {
            this.#_cartaoVacina = undefined;
            return;
        }

        if (typeof cartaoVacina == 'string') {
            // TODO: validar string de cartaoVacina
            this.#_cartaoVacina = cartaoVacina;
        } else {
            throw new TypeError('Valor inválido para cartaoVacina de pet: deve ser string ou undefined');
        }
    }

    get cartaoVacina() {
        return this.#_cartaoVacina;
    }

    constructor(pet) {
        if (!pet || typeof pet != 'object' || pet instanceof Array) {
            throw new TypeError('pet parameter must be an object containing Pet properties');
        }

        const {
            id,
            idEmpresa,
            dono,
            especie,
            nome,
            sexo,
            porte,
            eCastrado,
            estadoSaude,
            raca,
            cor,
            comportamento,
            cartaoVacina
        } = pet;

        this.id = id;
        this.idEmpresa = idEmpresa;
        this.dono = dono;
        this.especie = especie;
        this.nome = nome;
        this.sexo = sexo;
        this.porte = porte;
        this.eCastrado = eCastrado;
        this.estadoSaude = estadoSaude;
        this.raca = raca;
        this.cor = cor;
        this.comportamento = comportamento;
        this.cartaoVacina = cartaoVacina;
    }

    static fromResultSet(rs) {
        const objPet = {
            id: rs.id_pet,
            dono: { id: rs.id_cliente, nome: rs.nome_cliente },
            especie: { id: rs.id_especie, nome: rs.nome_especie },
            nome: rs.nome,
            sexo: rs.sexo,
            porte: rs.porte,
            eCastrado: (rs.e_castrado === "S"),
            estadoSaude: rs.estado_saude,
            raca: (rs.raca) ? rs.raca : undefined,
            cor: (rs.cor) ? rs.cor : undefined,
            comportamento: (rs.comportamento) ? rs.comportamento : undefined,
            cartaoVacina: (rs.cartao_vacina) ? rs.cartao_vacina : undefined
        };

        return objPet;
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
            options = { limit: 10000, page: 0, useClass: false };
        }

        const { id, idEmpresa, idCliente } = filter; // Object representando o Pet
        const { limit, page, useClass } = options;

        // Buscar no banco pets
        let petList = [];
        const conn = await empresaDB.createConnection({ id: idEmpresa });
        try {
            if (Number.isInteger(id)) {
                const [ results ] = await conn.execute(
                    'SELECT * FROM `vw_pet` WHERE `id_pet` = ? LIMIT 1',
                    [id]
                );
                if (results.length > 0) {
                    const objPet = Pet.fromResultSet(results[0]);
                    petList = [ useClass ? new Pet(objPet) : objPet ];
                }
            } else if (Number.isInteger(idCliente)) {
                const [ results ] = await conn.execute(
                    `SELECT * FROM vw_pet WHERE id_cliente = ? LIMIT ${limit} OFFSET ${limit * page}`,
                    [idCliente]
                );
                if (results.length > 0) {
                    petList = results.map( emp => {
                        const objPet = Pet.fromResultSet(emp);

                        return useClass ? new Pet(objPet) : objPet;
                    });
                }
            } else { // Buscar vários Pets
                let orderSQL = '';
                let filterSQL = '';

                if (filter.option) {
                    switch(filter.option) {
                        case 'nome': {
                            filterSQL += `WHERE nome LIKE '%${filter.query}%' `;

                            if (options.ordenacao) {
                                orderSQL += `ORDER BY nome ${(options.ordenacao != 'ascending') ? 'DESC' : 'ASC'}`;
                            }

                            break;
                        }
                        default: {}
                    }

                    if (filter.especie) {
                        filterSQL += `${filter.option ? 'AND' : ''}  id_especie = ${filter.especie} `;
                    }
                } else {
                    filterSQL = '';
                }

                const sql = `SELECT * FROM vw_pet ${filterSQL} ${orderSQL} LIMIT ${limit} OFFSET ${limit * page}`

                const [ results ] = await conn.execute(sql);


                if (results.length > 0) {
                    petList = results.map( emp => {
                        const objPet = Pet.fromResultSet(emp);

                        return useClass ? new Pet(objPet) : objPet;
                    });
                }
            }

            conn.end();
            return petList;
        } catch (err) {
            err.message = "Falha ao buscar registros de Pet: " + err.message;
            conn.end();
            throw err;
        }
    }

    async save(connParam) {
        if (connParam && typeof connParam != 'object') throw new TypeError('connParam parameter must be undefined or a connection object');
        const conn = (connParam) ? connParam : await empresaDB.createConnection({ id: this.idEmpresa });
        // Criar Pet
        try {
            const objPet = {
                id: this.id,
                idEmpresa: this.idEmpresa,
                nome: this.nome,
                sexo: this.sexo,
                porte: this.porte,
                estadoSaude: this.estadoSaude,
                raca: this.raca,
                cor: this.cor,
                comportamento: this.comportamento,
                cartaoVacina: this.cartaoVacina
            };

            objPet.dono = this.dono.id;
            objPet.especie = this.especie.id;
            objPet.eCastrado = (this.eCastrado) ? "S" : "N";

            const json = JSON.stringify(objPet);
            let idResponse;
            if (this.isNew) {
                const [ results ] = await conn.execute(
                    'CALL pet("insert", ?)',
                    [json]
                );

                idResponse = results[0][0].id_pet;
                this.id = idResponse;
            } else {
                const [ results ] = await conn.execute(
                    'CALL pet("update", ?)',
                    [json]
                );
                idResponse = this.id;
            }

            if (!connParam) conn.end();
            return idResponse;
        } catch (err) {
            if (!connParam) conn.end();
            err.message = "Falha ao cadastrar ou atualizar registro de pet: " + err.message;
            throw err;
        }
    }


    toJSON() {
        const  objJson = {
            id: this.id,
            idEmpresa: this.idEmpresa,
            dono: this.dono,
            especie: this.especie,
            nome: this.nome,
            sexo: this.sexo,
            porte: this.porte,
            eCastrado: this.eCastrado,
            estadoSaude: this.estadoSaude,
            raca: this.raca,
            cor: this.cor,
            comportamento: this.comportamento,
            cartaoVacina: this.cartaoVacina
        };

        return objJson;
    }

    toString() {}

}

module.exports = Pet;
