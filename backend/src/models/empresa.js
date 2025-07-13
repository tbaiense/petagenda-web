const  { dbo } = require('../db');

// Model para entidade Empresa

/* MODELO DA CLASSE
 *  {
 *      "id": 1,
 *      "nome_bd": "emp_1",
 *      "licenca": {
 *          tipo: "corporativo",
 *          inicio: "2001-01-31 10:45:21",
 *          fim: "2001-01-31 10:45:21",
 *      }
 *      "licenca_empresa": "corporativo",
 *      "dt_inicio_licenca": null,
 *      "dt_fim_licenca": null,
 *
 *      "cotas": {
 *          servico: 0,
 *          relatorioSimples: 0,
 *          relatorioDetalhado: 0
 *      },
 *
 *      "cota_servico": 0,
 *      "cota_relatorio_simples": 0,
 *      "cota_relatorio_detalhado": 0,
 *
 *      "razao_social": "TB LTDA",
 *      "nome_fantasia": "Empresa Tamo Bem",
 *      "cnpj": "00000000000000",
 *      "foto": null,
 *      "lema": null
 *  }
 */

class Empresa {
    static fromResultSet(emp) {
        if (!emp) {
           return {}; 
        }

        let licencaObj;
        if (emp.licenca_empresa) {
            licencaObj = {
                tipo: emp.licenca_empresa,
            };

            if (emp.dt_inicio_licenca) {
                licencaObj.inicio = emp.dt_inicio_licenca;
            }

            if (emp.dt_fim_licenca) {
                licencaObj.fim = emp.dt_fim_licenca;
            }
        }

        let cotasObj;
        if (Number.isInteger(emp.cota_servico) && Number.isInteger(emp.cota_relatorio_simples) && Number.isInteger(emp.cota_relatorio_detalhado)) {
            cotasObj = {
                servico: emp.cota_servico,
                relatorioSimples: emp.cota_relatorio_simples,
                relatorioDetalhado: emp.cota_relatorio_detalhado
            };
        }

        let enderecoObj;
        if (Number.isInteger(emp.id_endereco)) {
            enderecoObj = {
                id: emp.id_endereco,
                logradouro: emp.logradouro_endereco,
                numero: emp.numero_endereco,
                bairro: emp.bairro_endereco,
                cidade: emp.cidade_endereco,
                estado: emp.estado_endereco
            };
        }

        const empInfo = {
            id: emp.id,
            licenca: licencaObj,
            cotas: cotasObj,
            cnpj: emp.cnpj,
            nomeFantasia: emp.nome_fantasia,
            lema: emp.lema ?? undefined,
            endereco: enderecoObj,
        };

        if (emp.foto) {
            empInfo.foto = emp.foto;
        }

        if (emp.razao_social) {
            empInfo.razaoSocial = emp.razao_social;
        }

        return empInfo;
    }

    #_isNew = false;

    set isNew(isNew) {
        this.#_isNew = isNew;
    }

    get isNew() {
        return this.#_isNew;
    }

    #_id;
    #_licenca;

    set licenca(licenca) {
        const { tipo, inicio, fim } = licenca;

        if (licenca) {
            if (typeof licenca !== 'object') throw new TypeError('Informações de licença devem ser Object');

            this.#_licenca = {
                tipo: tipo,
                inicio: inicio,
                fim: fim
            };

        } else {
            this.#_licenca = null;
        }
    }

    get licenca() {
        return this.#_licenca;
    }


    #_cotas;

    set cotas(cotas) {

        if (cotas) {
            const { servico, relatorioSimples, relatorioDetalhado } = cotas;
            if (typeof cotas !== 'object') throw new TypeError('Informações de cotas devem ser Object');

            this.#_cotas = {
                servico: servico,
                relatorioSimples: relatorioSimples,
                relatorioDetalhado: relatorioDetalhado
            };

        } else {
            this.#_cotas = null;
        }
    }

    get cotas() {
        return this.#_cotas;
    }

    #_razaoSocial;
    #_cnpj;
    #_nomeFantasia;
    #_lema;
    #_foto;
    #_endereco;


    static async find(filter, options) {
        if (filter && !(filter instanceof Object)) {
            throw new TypeError('Filter deve ser Object');
        }

        if (options && !(options instanceof Object)) {
            throw new TypeError('Options deve ser Object');
        }

        if (!filter) {
            filter = { id: undefined, cnpj: undefined };
        } else {
            if (!Number.isInteger(filter.id)) {
                filter.id = undefined;
            }

            if (!Number.isInteger(filter.cnpj)) {
                filter.cnpj = undefined;
            }
        }

        if (!options || (!Number.isInteger(options.limit) || !Number.isInteger(options.page))) {
            options = { limit: 10, page: 0, useClass: false };
        }

        const { id } = filter; // Object representando a empresa
        const { limit, page, useClass } = options;

        // Buscar no banco empresas
        let empresaList = [];
        const conn = await dbo.createConnection();

        try {
            if (Number.isInteger(id)) { 
                const [ results ] = await conn.execute(
                    `SELECT * FROM vw_empresa WHERE id = ? LIMIT 1`,
                    [id]
                );

                if (results.length > 0) {
                    const objEmp = Empresa.fromResultSet(results[0]);
                    empresaList = [ useClass ? new Empresa(objEmp) : objEmp ];
                }
            } else { // Buscar várias empresas
                const [ results ] = await conn.execute(
                    `SELECT * FROM vw_empresa ORDER BY id DESC LIMIT ${limit} OFFSET ${limit * page}`
                );
                if (results.length > 0) {
                    empresaList = results.map( emp => {
                        const objEmp = Empresa.fromResultSet(emp);
    
                        return useClass ? new Empresa(objEmp) : objEmp;
                    });              
                }
            }
            conn.end();
            return empresaList;
        } catch (err) {
            conn.end();
            err.message = "Falha ao buscar registros de empresa: " + err.message;
            throw err;
        }
    }

    // Cria ou atualiza registro de empresa no banco
    async save(connParam = undefined) {
        if (connParam && typeof connParam != 'object') throw new TypeError('connParam parameter must be undefined or a connection object');

        const conn = (connParam) ? connParam : await dbo.createConnection();
        try {
            // Criar empresa
            let idResponse;
            const jsonEmp = JSON.stringify(this);
            console.log('json da empresa: \n', jsonEmp);
            if (this.isNew) {
                const [ results ] = await conn.execute(
                    'CALL empresa("insert", ?)',
                    [jsonEmp]
                );

                idResponse = results[0][0].id_empresa;
                this.id = idResponse;
            } else {
                const [ results ] = await conn.execute(
                    'CALL empresa("update", ?)',
                    [jsonEmp]
                );
                idResponse = results[0][0].id_empresa;
            }
            if (!connParam) conn.end();
            return idResponse;
        } catch (err) {
            if (!connParam) conn.end();
            err.message = "Falha ao executar cadastro ou atualização de registro de empresa: " + err.message;
            throw err;
        }
    }

    constructor(emp) {
        if (emp instanceof Number) {
            this.id = emp;
        } else {
            const { id, licenca, cotas, razaoSocial, nomeFantasia, cnpj, foto, lema, endereco } = emp;

            if (!id) {
                this.isNew = true;
            } else {
                this.id = id
            }

            if (!nomeFantasia || !cnpj) {
                throw new Error("Nome fantasia ou CNPJ não informado");
            }


            this.nomeFantasia = nomeFantasia;
            this.cnpj = cnpj; // TODO: validar CNPJ

            if (razaoSocial) {
                this.razaoSocial = razaoSocial;
            }

            if (lema) {
                this.lema = lema;
            }

            if (foto) {
                this.foto = foto;
            }

            if (endereco) {
                this.endereco = endereco;
            }

            if (licenca) {
                this.licenca = licenca;
            }

            if (cotas) {
                this.cotas = cotas;
            }
        }

    }

    set id(id) {
        if (!this.#_id) {
            if (id && !Number.isInteger(id)) {
                throw new TypeError('Id da empresa deve ser inteiro');
            }

            this.#_id = id;
            this.isNew = false;
        }
    }

    get id() {
        return this.#_id;
    }

    set nomeFantasia(value) {
        if (typeof value == 'string') {
            this.#_nomeFantasia = value;
        } else {
            throw new TypeError('Nome fantasia deve ser String');
        }
    }

    get nomeFantasia() {
        return this.#_nomeFantasia;
    }

    set razaoSocial(value) {
        if (typeof value == 'string') {
            this.#_razaoSocial = value;
        } else if (!value) {
            this.#_razaoSocial = undefined;
        } else {
            throw new TypeError("Razão social deve ser String");
        }
    }


    get razaoSocial() {
        return this.#_razaoSocial;
    }

    set cnpj(value) { // TODO: Validar CNPJ
        if (typeof value == 'string') {
            this.#_cnpj = value;
        } else {
            throw new TypeError('CNPJ deve ser String');
        }
    }

    get cnpj() {
        return this.#_cnpj;
    }

    set lema(value) {
        if (typeof value == 'string') {
            this.#_lema = value;
        } else if (!value) {
            this.#_lema = undefined;
        } else {
            throw new TypeError("Lema deve ser String");
        }
    }

    get lema() {
        return this.#_lema;
    }

    set foto(value) {
        if (typeof value == 'string') {
            this.#_foto = value;
        } else if (!value) {
            this.#_foto = undefined;
        } else {
            throw new TypeError("Foto deve ser String");
        }
    }

    get foto() {
        return this.#_foto;
    }

    set endereco(endereco) {
        if (endereco) {
            if (typeof endereco !== 'object') throw new TypeError('Informações de endereço devem ser Object');

            const { id, logradouro, numero, bairro, cidade, estado } = endereco;

            if (!logradouro || typeof logradouro != 'string') {
                throw new TypeError('Logradouro deve ser String');
            }

            if (!numero || typeof numero != 'string') {
                throw new TypeError('Número deve ser String');
            }

            if (!bairro || typeof bairro != 'string') {
                throw new TypeError('Bairro deve ser String');
            }

            if (!cidade || typeof cidade != 'string') {
                throw new TypeError('Cidade deve ser String');
            }

            if (!estado || typeof estado != 'string') {
                throw new TypeError("Estado deve ser String");
            }

            this.#_endereco = {
                logradouro: logradouro,
                numero: numero,
                bairro: bairro,
                cidade: cidade,
                estado: estado
            };

            if (Number.isInteger(id)) {
                this.#_endereco.id = id;
            }
        } else {
            this.#_endereco = null;
        }

    }

    get endereco() {
        return this.#_endereco;
    }

    toJSON() {
        return {
            id: this.id,
            licenca: this.licenca,
            razaoSocial: this.razaoSocial,
            cnpj: this.cnpj,
            nomeFantasia: this.nomeFantasia,
            lema: this.lema,
            foto: this.foto,
            endereco: this.endereco,
        };
    }
};

module.exports = Empresa;
