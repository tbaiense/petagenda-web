const { empresa: empresaDB } = require('../db');

/*
 * Modelo de classe para Incidente
 * JSON:
{
    "id": <INT>,
    "idEmpresa": <INT>,
    "servicoRealizado": {
        "id": <INT>
    },
    "tipo": {
        "id": <ENUM("emergencia-medica", "briga", "mau-comportamento", "agressao")>,,
        "nome": <VARCHAR>
    }
    "dtHrOcorrido": <DATETIME>,
    "relato": <TEXT>,
    "medidaTomada": ?<TEXT>
}
 *
 */
class Incidente {

    #_isNew;

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
        if (!Number.isInteger(idEmpresa)) throw new TypeError('idEmpresa must be an integer');

        this.#_idEmpresa = idEmpresa;
    }

    get idEmpresa() {
        return this.#_idEmpresa;
    }

    #_servicoRealizado;

    set servicoRealizado(servicoRealizado) {
        if (servicoRealizado) {
            if (typeof servicoRealizado !== 'object') throw new TypeError('Informações de servicoRealizado devem ser Object');

            this.#_servicoRealizado = {
                id: servicoRealizado.id,
            };

        } else {
            throw new TypeError('Objeto de servicoRealizado do serviço realizado não pode ser nulo');
        }
    }

    get servicoRealizado() {
        return this.#_servicoRealizado;
    }

    #_tipo;

    set tipo(tipo) {
        if (!tipo || typeof tipo != 'object') throw new TypeError('parâmetro tipo deve ser um objeto contendo o tipo do incidente');

        let nome;
        switch (tipo.id) {
            case 'emergencia-medica': {
                nome = "Emergência Médica";
                break;
            }
            case 'briga': {
                nome = "Briga";
                break;
            }
            case 'agressao': {
                nome = "Agressão";
                break;
            }
            case 'mau-comportamento': {
                nome = "Mau comportamento";
                break;
            }
            default: {
                throw new Error('tipo deve ser "emergencia-medica", "briga", "mau-comportamento" ou "agressao"');
            }
        }

        this.#_tipo = {
            id: tipo.id,
            nome: nome
        };
    }

    get tipo() {
        return this.#_tipo;
    }

    #_dtHrOcorrido;

    set dtHrOcorrido(dtHrOcorrido) {
        if (typeof dtHrOcorrido != 'string' || dtHrOcorrido.length < 8) throw new TypeError('dtHrOcorrido value must be a string representing a date');
        // TODO: validar string de data
        this.#_dtHrOcorrido = dtHrOcorrido;
    }

    get dtHrOcorrido() {
        return this.#_dtHrOcorrido;
    }


    #_relato;

    set relato(relato) {
        if (typeof relato == 'string') {
            // TODO: validar string de relato
            this.#_relato = relato;
        } else {
            throw new TypeError('Valor inválido para relato de servicoRealizado: deve ser string');
        }
    }

    get relato() {
        return this.#_relato;
    }

    #_medidaTomada;

    set medidaTomada(medidaTomada) {
        if (!medidaTomada) {
            this.#_medidaTomada = undefined;
            return;
        }

        if (typeof medidaTomada == 'string') {
            // TODO: validar string de medidaTomada
            this.#_medidaTomada = medidaTomada;
        } else {
            throw new TypeError('Valor inválido para medidaTomada de incidente: deve ser string ou undefined');
        }
    }

    get medidaTomada() {
        return this.#_medidaTomada;
    }

    constructor(incidente) {
        try {
            if (!incidente || typeof incidente != 'object') {
                throw new TypeError('parâmetro de incidente para construtor deve ser um objeto contendo as informações necessárias');
            }
            const {
                id,
                idEmpresa,
                servicoRealizado,
                tipo,
                dtHrOcorrido,
                relato,
                medidaTomada
            } = incidente;

            this.id = id;
            this.idEmpresa = idEmpresa;
            this.servicoRealizado = servicoRealizado;
            this.dtHrOcorrido = dtHrOcorrido;
            this.tipo = tipo;
            this.relato = relato;
            this.medidaTomada = medidaTomada;

        } catch (err) {
            err.message = "Falha ao instanciar incidente: " + err.message;
            throw err;
        }
    }

    async save(connParam) {
        if (connParam && typeof connParam != 'object') {
            throw new TypeError('Parâmetro de conexão é inválido para função de salvamento de incidente');
        }

        const conn = (connParam) ? connParam : await empresaDB.createConnection({ id: this.idEmpresa });
        try {
            const objInc = {
                id: this.id,
                servicoRealizado: this.servicoRealizado.id,
                tipo: this.tipo.id,
                dtHrOcorrido: this.dtHrOcorrido,
                relato: this.relato,
                medidaTomada: this.medidaTomada
            };

            const json = JSON.stringify(objInc);
            let idResponse;
            if (this.isNew) {
                const [ results ] = await conn.execute(
                    'CALL incidente("insert", ?)',
                    [json]
                );

                idResponse = results[0][0].id_incidente;
                this.id = idResponse;
            } else {
                const [ results ] = await conn.execute(
                    'CALL incidente("update", ?)',
                    [json]
                );
                idResponse = this.id;
            }

            if (!connParam) conn?.end();
            return idResponse;
        } catch (err) {
            if (!connParam) conn?.end();
            err.message = "Falha ao atualizar ou cadastrar incidente: ";

            if (err.errno == 1452) {
                err.message += "o incidente referido não existe"
            } else {
                err.message += err.message;
            }
            throw err;
        }
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
            options = { limit: 10, page: 0, useClass: true };
        } else {
            if (!Number.isInteger(options.limit)) {
                options.limit = 10;
            }

            if (!Number.isInteger(options.page)) {
                options.page = 0;
            }

            if (typeof options.useClass != 'boolean') {
                options.useClass = false;
            }
        }

        const { id, idEmpresa } = filter; // Object representando o Incidente
        const { limit, page, useClass } = options;

        // Buscar no banco incidentes
        let incList = [];
        const conn = await empresaDB.createConnection({ id: idEmpresa });
        try {
            if (Number.isInteger(id)) {
                const [ results ] = await conn.execute(
                    'SELECT * FROM `incidente` WHERE `id` = ? LIMIT 1',
                    [id]
                );
                if (results.length > 0) {
                    let objInc = Incidente.fromResultSet(results[0]);

                    if (useClass) {
                        objInc.idEmpresa = idEmpresa;
                        objInc = new Incidente(objInc);
                    }

                    incList = [ objInc ];
                }
            } else { // Buscar vários Incidentes
                const [ results ] = await conn.execute(
                    `SELECT * FROM incidente ORDER BY id DESC LIMIT ${limit} OFFSET ${limit * page}`
                );

                if (results.length > 0) {
                    incList = results.map( inc => {
                        let objInc = Incidente.fromResultSet(inc);

                        if (useClass) {
                            objInc.idEmpresa = idEmpresa;
                            objInc = new Incidente(objInc);
                        }

                        return objInc;
                    });
                }
            }

            conn?.end();
            return incList;
        } catch (err) {
            err.message = "Falha ao buscar registros de incidentes: " + err.message;
            conn?.end();
            throw err;
        }
    }

    static fromResultSet(rs) {
        const objInc = {
            id: rs.id,
            servicoRealizado: {
                id: rs.id_servico_realizado
            },
            tipo: {
                id: rs.tipo
            },
            dtHrOcorrido: rs.dt_hr_ocorrido,
            relato: rs.relato,
            medidaTomada: rs.medida_tomada
        };

        return objInc;
    }

    toJSON() {
        const objJson = {
            id: this.id,
            servicoRealizado: this.servicoRealizado,
            tipo: this.tipo,
            dtHrOcorrido: this.dtHrOcorrido,
            relato: this.relato,
            medidaTomada: this.medidaTomada
        };

        return objJson;
    }

    toString() {}

}

module.exports = Incidente;


// Testes
/*
const inc = new Incidente({
    "idEmpresa": 1,
    "servicoRealizado": {
        "id": 1
    },
    "tipo": {
        "id": "emergencia-medica"
    },
    "dtHrOcorrido": "2025-05-31T08:00:00",
    "relato": "isso e aquilo",
    "medidaTomada": "carinho"
});


async function cadastrar() {
    const id = await inc.save();

    const found = await Incidente.find({ id: id, idEmpresa: inc.idEmpresa }, {useClass: true});
    console.log(JSON.stringify(found));
}


cadastrar();*/
