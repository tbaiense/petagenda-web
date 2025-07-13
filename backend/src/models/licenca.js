const { dbo, empresa: empresaDB } = require('../db');
/*
MODELO DE LICENÇA DE EMPRESA

Modelo JSON:
{
    idEmpresa: Number,
    temSchema: Boolean,
    tipo: Enum("basico", "profissional", "corporativo"),
    inicio: DateTimeString,
    fim: DateTimeString
}
    */
   
class Licenca {
    
    static fromResultSet(rs) {
        const licObj = {
            idEmpresa: rs.id,
            temSchema: !!rs.tem_schema,
            tipo: rs.licenca_empresa ?? undefined,
            inicio: rs.dt_inicio_licenca ?? undefined,
            fim: rs.dt_fim_licenca ?? undefined
        };

        return licObj;
    }
    
    static async find(filter, options) {
        if (typeof filter != 'object') {
            throw new TypeError('filter parameter must be an object');
        }

        if (typeof filter.idEmpresa != "number" || !Number.isInteger(filter.idEmpresa)) {
            throw new TypeError('idEmpresa field of filter parameter must be an integer');
        }

        if (!options) {
            options = { useClass: false };
        } else if (typeof options != 'object') {
            throw new TypeError('options parameter must be an object or be null or undefined');
        }

        let licencaResult = [];
        let conn;
        try {
            conn = await dbo.createConnection();
            
            const [ results ] = await conn.execute(
                'SELECT `id`, IF(`nome_bd` IS NOT NULL, TRUE, FALSE) AS tem_schema, `licenca_empresa`, `dt_inicio_licenca`, `dt_fim_licenca` FROM `empresa` WHERE `id` = ? LIMIT 1',
                [filter.idEmpresa]
            );
            
            if (results[0]) {
                const licObj = Licenca.fromResultSet(results[0]);
                if (options.useClass) {
                    licencaResult[0] = new Licenca(licObj);
                } else {
                    licencaResult[0] = licObj;
                }
            }

            conn.end();
            return licencaResult;
        } catch (err) {
            conn?.end();
            throw new Error("Falha ao consultar licença de empresa: " + err.message);
        }
    }

    // Instance fields and accessors
    #_isNew;

    set isNew(isNew) {
        if (typeof isNew != 'boolean') throw new TypeError('value for isNew must be boolean');

        this.#_isNew = isNew;
    }

    get isNew() {
        return this.#_isNew;
    }

    #_idEmpresa;

    set idEmpresa(idEmpresa) {
        if (!Number.isInteger(idEmpresa)) throw new TypeError('idEmpresa must be an integer');

        this.#_idEmpresa = idEmpresa;
    }

    get idEmpresa() {
        return this.#_idEmpresa;
    }

    #_temSchema;

    set temSchema(temSchema) {
        this.#_temSchema = !!temSchema;
    }

    get temSchema() {
        return this.#_temSchema;
    }

    #_tipo;

    set tipo(tipo) {
        if (typeof tipo != 'string') throw new TypeError('tipo value must be a string');

        if (tipo == 'basico' || tipo == 'profissional' || tipo == 'corporativo') {
            this.#_tipo = tipo;
        } else {
            throw new Error('invalid value for tipo in licenca');
        }
    }

    get tipo() {
        return this.#_tipo;
    }

    #_inicio;

    set inicio(inicio) {
        if (typeof inicio != 'string' || inicio.length < 8) throw new TypeError('inicio value must be a string representing a date');
        // TODO: validar string de data
        this.#_inicio = inicio;
    }

    get inicio() {
        return this.#_inicio;
    }

    #_fim;

    set fim(fim) {
        if (typeof fim != 'string' || fim.length < 8) throw new TypeError('fim value must be a string representing a date');
        // TODO: validar string de data
        this.#_fim = fim;
    }

    get fim() {
        return this.#_fim;
    }

    constructor(licencaEmpresa) {
        if (typeof licencaEmpresa != 'object') throw new TypeError('licenca parameter must be an object');

        const {
            idEmpresa,
            temSchema,
            tipo,
            inicio,
            fim
        } = licencaEmpresa;

        this.idEmpresa = idEmpresa;
        this.temSchema = temSchema;
        this.tipo = tipo;
        this.inicio = inicio;
        this.fim = fim;
    }
    
    async save(connParam) {
        if (connParam && typeof connParam != 'object') throw new TypeError('connParam parameter must be undefined or a connection object');
        const conn = (connParam) ? connParam : await dbo.createConnection();

        const { idEmpresa, tipo, inicio, fim } = this;
        try {
            // Definir se licença existe ou não
            const found = await Licenca.find({ idEmpresa: this.idEmpresa });
            this.isNew = !(found[0].temSchema);
            
            // Definir licenca
            const [ updateInfo ] = await conn.execute(
                'UPDATE empresa SET ' 
                + '`licenca_empresa` = ?, `dt_inicio_licenca` = ?, `dt_fim_licenca` = ? ' 
                + 'WHERE `id` = ? LIMIT 1',
                [tipo ?? null, inicio ?? null, fim ?? null, idEmpresa]
            );
            
            // Criação de SCHEMA para a empresa, se não houver
            if (this.isNew) {
                await empresaDB.createSchema(idEmpresa);
            }
            this.isNew = false;
            if (!connParam) conn.end();
            return idEmpresa;
        } catch (err) {
            if (!connParam) conn.end();
            err.message = "Falha ao executar cadastro ou atualização de registro de licença de empresa: " + err.message;
            throw err;
        }
    }
    
    toJSON() {}
    
    toString() {}
}

module.exports = Licenca;
