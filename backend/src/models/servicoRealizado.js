const { empresa: empresaDB } = require('../db');
/*
 * Modelo de classe para ServicoRealizado
 * JSON:
{
    "id": <INT>,
    "idInfoServico": <INT>,
    "idEmpresa": <INT>,
    "inicio": <DATETIME>,
    "fim": <DATETIME>,
    "servico": { "id": <INT> },
    "valor": {
        "servico": <DECIMAL>,
        "pets": <DECIMAL>,
        "total": <DECIMAL>
    }
    "funcionario": { "id": <INT> },
    "observacoes": ?<VARCHAR(250)>,
    "pets" : ?[
        +{
            "id": ?<INT>,
            "idPetServico": ?<INT>,
            "alimentacao": ?<TEXT>,
            "remedios": ?[
                +{ "id": <INT>, "nome": ?<VARCHAR(128)>, "instrucoes": ?<TEXT> }
            ]
        }
    ],
    "enderecos": [
        0,2{
            "tipo": <ENUM("buscar", "devolver", "buscar-devolver")>,
            "logradouro": <VARCHAR(128)>,
            "numero": <VARCHAR(16)>,
            "bairro": <VARCHAR(64)>,
            "cidade": <VARCHAR(64)>,
            "estado": <CHAR(2)>
        }
    ]
}
 *
 */
class ServicoRealizado {

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

    #_idInfoServico;

    set idInfoServico(idInfoServico) {
        if (Number.isInteger(idInfoServico)) {
            this.#_idInfoServico = idInfoServico;

        } else if (idInfoServico == null || idInfoServico == undefined) {
            this.#_idInfoServico = undefined;
        } else {
            throw new TypeError('idInfoServico must be an integer or null or undefined');
        }
    }

    get idInfoServico() {
        return this.#_idInfoServico;
    }

    #_idEmpresa;

    set idEmpresa(idEmpresa) {
        if (!Number.isInteger(idEmpresa)) throw new TypeError('idEmpresa must be an integer');

        this.#_idEmpresa = idEmpresa;
    }

    get idEmpresa() {
        return this.#_idEmpresa;
    }

    #_inicio;

    set inicio(inicio) {
        if (!inicio) {
            this.#_inicio = undefined;
        } else if (typeof inicio != 'string' || inicio.length < 8) throw new TypeError('inicio value must be a string representing a date');

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

    #_servico;

    set servico(servico) {
        if (servico) {
            if (typeof servico !== 'object') throw new TypeError('Informações de servico devem ser Object');

            this.#_servico = {
                ...servico
            };

        } else {
            throw new TypeError('Objeto de servico do serviço realizado não pode ser nulo');
        }
    }

    get servico() {
        return this.#_servico;
    }

    #_valor;

    set valor(valor) {
        if (valor && typeof valor == 'object') {
            this.#_valor = {
                servico: valor.servico,
                pets: valor.pets,
                total: valor.total
            };
        } else {
            this.#_valor = undefined;
        }
    }

    get valor() {
        return this.#_valor;
    }

    #_funcionario;

    set funcionario(funcionario) {
        if (funcionario) {
            if (typeof funcionario !== 'object') throw new TypeError('Informações de funcionario devem ser Object');

            this.#_funcionario = {
                ...funcionario
            };
        } else {
            throw new TypeError('Objeto de funcionario do serviço realizado não pode ser nulo');
        }
    }

    get funcionario() {
        return this.#_funcionario;
    }

    #_observacoes;

    set observacoes(observacoes) {
        if (!observacoes) {
            this.#_observacoes = undefined;
            return;
        }

        if (typeof observacoes == 'string') {
            // TODO: validar string de observacoes
            this.#_observacoes = observacoes;
        } else {
            throw new TypeError('Valor inválido para observacoes de servicoRealizado: deve ser string ou undefined');
        }
    }

    get observacoes() {
        return this.#_observacoes;
    }


    #_pets;

    set pets(pets) {
        if (!pets) {
            this.#_pets = undefined;
        } else if (pets instanceof Array) {
            this.#_pets = pets.map( pet => {
                if (Number.isInteger(pet.id)) {
                    const objServReal = {
                        id: pet.id,
                        alimentacao: (pet.alimentacao) ? pet.alimentacao : undefined
                    };
                    const remedios = pet.remedios;

                    if (remedios && remedios instanceof Array) {
                        objServReal.remedios = remedios.map( remedio => {
                            if (!remedio.nome || !remedio.instrucoes) {
                                throw new Error('Um ou mais registros de remédio para pet não possuem nome e/ou instruções');
                            }

                            return {
                                id: (Number.isInteger(remedio.id)) ? remedio.id : undefined,
                                                          nome: remedio.nome,
                                                          instrucoes: remedio.instrucoes
                            };
                        });
                    }

                    return objServReal;
                } else {
                    throw new TypeError('pets contain objects that do not have a valid id value: must be integer');
                }
            });
        } else {
            throw new Error('pets must be undefined or an array containing Pet objects');
        }
    }

    get pets() {
        return this.#_pets;
    }

    #_enderecos;

    set enderecos(enderecos) {
        if (!enderecos) {
            this.#_enderecos = undefined;
            return;
        } else if (!(enderecos instanceof Array)) {
            throw new TypeError('Objeto de endereço deve ser vazio ou um vetor contendo no máximo dois endereços');
        } else if (enderecos.length > 2) {
            throw new Error("Não é permitido atribuir mais de dois endereços ao servicoRealizado");
        }

        if (typeof enderecos == 'object') {
            this.#_enderecos = enderecos.map( endereco => {

                switch (endereco.tipo) {
                    case 'buscar':
                    case 'devolver':
                    case 'buscar-devolver': break;
                    default: throw new TypeError("Tipo para endereço não reconhecido: deve ser 'buscar', 'devolver' ou 'buscar-devolver'");
                }

                if (!endereco.logradouro || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado) {
                    throw new TypeError('endereco object is missing one or more required properties: logradouro, numero, bairro, cidade or estado');
                }

                return {
                    tipo: endereco.tipo,
                    logradouro: endereco.logradouro,
                    numero: endereco.numero,
                    bairro: endereco.bairro,
                    cidade: endereco.cidade,
                    estado: endereco.estado
                };
            });
        } else {
            throw new TypeError('endereço deve ser um objeto ou indefinido');
        }
    }

    get enderecos() {
        return this.#_enderecos;
    }

    #_cliente;

    set cliente(cliente) {
        if (typeof cliente == 'object') {
            this.#_cliente = {
                id: cliente.id,
                nome: cliente.nome
            }
        }
    }

    get cliente() {
        return this.#_cliente;
    }


    constructor(servicoRealizado) {
        try {
            if (!servicoRealizado || typeof servicoRealizado != 'object') {
                throw new TypeError('parâmetro de servicoRealizado para construtor deve ser um objeto contendo as informações necessárias');
            }
            const {
                id,
                idEmpresa,
                idInfoServico,
                inicio,
                fim,
                servico,
                valor,
                funcionario,
                observacoes,
                pets,
                enderecos,
                cliente
            } = servicoRealizado;

            this.id = id;
            this.idEmpresa = idEmpresa;
            this.idInfoServico = idInfoServico
            this.inicio = inicio;
            this.fim = fim;
            this.servico = servico;
            this.valor = valor;
            this.funcionario = funcionario;
            this.observacoes = observacoes;
            this.pets = pets;
            this.enderecos = enderecos;
            this.cliente = cliente;

        } catch (err) {
            err.message = "Falha ao instanciar serviço realizado: " + err.message;
            throw err;
        }
    }

    async save(connParam) {
        if (connParam && typeof connParam != 'object') {
            throw new TypeError('Parâmetro de conexão é inválido para função de salvamento de serviço realizado');
        }

        const conn = (connParam) ? connParam : await empresaDB.createConnection({ id: this.idEmpresa });
        try {
            const objServReal = {
                id: this.id,
                inicio: this.inicio,
                fim: this.fim,
                info: {
                    servico: this.servico.id,
                    funcionario: this.funcionario?.id,
                    observacoes: this.observacoes,
                    pets : this.pets,
                    enderecos: this.enderecos
                }
            };

            const json = JSON.stringify(objServReal);
            let idResponse;
            if (this.isNew) {
                const [ results ] = await conn.execute(
                    'CALL servico_realizado("insert", ?)',
                     [json]
                );

                idResponse = results[0][0].id_servico_realizado;
                this.id = idResponse;
            } else {
                const [ results ] = await conn.execute(
                    'CALL servico_realizado("update", ?)',
                    [json]
                );
                idResponse = this.id;
            }

            if (!connParam) conn.end();
            return idResponse;
        } catch (err) {
            if (!connParam) conn?.end();

            err.message = "Falha ao atualizar ou cadastrar serviço realizado: " + err.message;
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
            options = {};
        }

        if (!Number.isInteger(options.limit)) {
            options.limit = 10;
        }

        if (!Number.isInteger(options.page)) {
            options.page = 0;
        }

        if (typeof options.useClass != 'boolean') {
            options.useClass = false;
        }

        const { id, idEmpresa } = filter; // Object representando o ServicoRealizado
        const { limit, page, useClass } = options;

        // Buscar no banco servicoRealizados
        let servList = [];
        const conn = await empresaDB.createConnection({ id: idEmpresa });
        let qtdServicosRealizados;
        try {
            if (Number.isInteger(id)) {
                const [ results ] = await conn.execute(
                    'SELECT * FROM `vw_servico_realizado` WHERE `id_servico_realizado` = ? LIMIT 1',
                    [id]
                );
                if (results.length > 0) {
                    qtdServicosRealizados = results[0].qtd_servico_realizado;

                    const objServReal = ServicoRealizado.fromResultSet(results[0]);

                    objServReal.idEmpresa = +filter.idEmpresa;

                    servList = [ useClass ? new ServicoRealizado(objServReal) : objServReal ];
                }
            } else { // Buscar vários ServicoRealizados
                let sql, params;
                if (filter.query) {
                    let filterSQL = '';

                    let orderSQL = 'id_servico_realizado DESC';

                    switch (filter.option) {
                        case 'cliente': {
                            filterSQL += `nome_cliente LIKE '%${filter.query}%' `;

                            orderSQL = `nome_cliente ${(options.ordenacao == 'ascending') ? 'ASC' : 'DESC'} `
                        }
                        default: {}
                    }

                    sql = 'SELECT '
                            + 'COUNT(s_r.id) OVER() AS qtd_servico_realizado, '
                            + 's_r.id AS id_servico_realizado, '
                            + 's_r.dt_hr_inicio AS dt_hr_inicio, '
                            + 's_r.dt_hr_fim AS dt_hr_fim, '
                            + 's_r.valor_servico AS valor_servico, '
                            + 's_r.valor_total AS valor_total, '
                            + 'i_s.* '
                        + 'FROM servico_realizado AS s_r '
                            + 'INNER JOIN vw_info_servico AS i_s ON (i_s.id_info_servico = s_r.id_info_servico) '
                        + `WHERE ${filterSQL} `
                        + `ORDER BY ${orderSQL}, dt_hr_fim DESC LIMIT ${limit} OFFSET ${limit * page}`;

                    params = [filter.query];

                } else {
                    sql = `SELECT * FROM vw_servico_realizado ORDER BY id_servico_realizado DESC LIMIT ${limit} OFFSET ${limit * page}`;
                }

                const [ results ] = await conn.execute(sql, params);


                if (results.length > 0) {
                    qtdServicosRealizados = results[0].qtd_servico_realizado;

                    servList = results.map( serv => {
                        const objServReal = ServicoRealizado.fromResultSet(serv);
                        objServReal.idEmpresa = +filter.idEmpresa;
                        return useClass ? new ServicoRealizado(objServReal) : objServReal;
                    });
                }
            }

            // anexar pets ao objeto de resposta
            if (servList.length > 0) {
                const idList = servList.map( serv => {
                    return serv.idInfoServico;
                });


                const idListStr = idList.join(",");

                const [ petServ ] = await conn.execute(
                    `SELECT id_pet_servico, id_pet, instrucao_alimentacao, id_info_servico FROM vw_pet_servico WHERE id_info_servico IN (${idListStr})`
                );

                if (!petServ) {
                    throw new Error('Falha ao obter registros de pets para o serviço realizado');
                }

                const idListPetServ = petServ.map( pet => {
                    return pet.id_pet_servico;
                });

                const idListPetServStr = idListPetServ.join(',');

                let [ remPetServ ] = await conn.execute(
                    `SELECT id, id_pet_servico, nome, instrucoes FROM remedio_pet_servico WHERE id_pet_servico IN (${idListPetServStr})`
                );

                // Associando pets aos remédios encontrados
                let petServList = petServ.map( pet => {
                    const petServ = {
                        id: pet.id_pet,
                        idInfoServico: pet.id_info_servico,
                        instrucaoAlim: pet.instrucao_alimentacao,
                        remedios: []
                    };

                    if (remPetServ) {
                        remPetServ = remPetServ.flatMap( rem => {
                            if (rem.id_pet_servico == pet.id_pet_servico) {

                                petServ.remedios.push({
                                    id: rem.id,
                                    nome: rem.nome,
                                    instrucoes: rem.instrucoes
                                });

                                return [];
                            } else {
                                return rem;
                            }
                        });
                    }

                    if (!petServ.remedios) {
                        petServ.remedios = undefined;
                    }
                    return petServ;
                });

                servList = servList.map( serv => {
                    serv.pets = [];

                    petServList = petServList.flatMap( pet => {
                        if (pet.idInfoServico == serv.idInfoServico) {
                            serv.pets.push({
                                id: pet.id,
                                instrucaoAlim: pet.instrucaoAlim ?? undefined,
                                remedios: (pet.remedios?.length > 0) ? pet.remedios : undefined
                            });

                            return [];
                        } else {
                            return pet;
                        }
                    });

                    return serv;
                });
            }

            conn.end();
            return { servList, qtdServicosRealizados };
        } catch (err) {
            err.message = "Falha ao buscar registros de serviços realizados: " + err.message;
            conn.end();
            throw err;
        }
    }

    static fromResultSet(rs) {
        const objServReal = {
            "id": rs.id_servico_realizado,
            "idInfoServico": rs.id_info_servico,
            "inicio": rs.dt_hr_inicio,
            "fim": rs.dt_hr_fim,
            "servico": {
                "id": rs.id_servico_oferecido,
                "nome": rs.nome_servico_oferecido
            },
            "valor": {
                "servico": rs.valor_servico ?? 0,
                "pets": (!rs.valor_servico && rs.valor_total) ? rs.valor_total : 0,
                "total": rs.valor_total ?? 0
            },
            "funcionario": { "id": rs.id_funcionario, "nome": rs.nome_funcionario },
            "observacoes": (rs.observacoes) ? rs.observacoes : undefined,
            "cliente": (rs.id_cliente) ? {
                id: rs.id_cliente,
                nome: rs.nome_cliente
            } : undefined
        };

        if (rs.tipo_endereco_buscar != rs.tipo_endereco_devolver) {
            objServReal.enderecos = [];
            if (rs.tipo_endereco_buscar) {
                objServReal.enderecos.push({
                    "tipo": rs.tipo_endereco_buscar,
                    "logradouro": rs.logradouro_endereco_buscar,
                    "numero": rs.numero_endereco_buscar,
                    "bairro": rs.bairro_endereco_buscar,
                    "cidade": rs.cidade_endereco_buscar,
                    "estado": rs.estado_endereco_buscar
                });
            }

            if (rs.tipo_endereco_devolver) {
                objServReal.enderecos.push({
                    "tipo": rs.tipo_endereco_devolver,
                    "logradouro": rs.logradouro_endereco_devolver,
                    "numero": rs.numero_endereco_devolver,
                    "bairro": rs.bairro_endereco_devolver,
                    "cidade": rs.cidade_endereco_devolver,
                    "estado": rs.estado_endereco_devolver
                });
            }

            if (!objServReal.enderecos) {
                objServReal.enderecos = undefined;
            }

        } else if (rs.tipo_endereco_buscar) {
            objServReal.enderecos = [{
                "tipo": rs.tipo_endereco_buscar,
                "logradouro": rs.logradouro_endereco_buscar,
                "numero": rs.numero_endereco_buscar,
                "bairro": rs.bairro_endereco_buscar,
                "cidade": rs.cidade_endereco_buscar,
                "estado": rs.estado_endereco_buscar
            }];
        }
        return objServReal;
    }

    toJSON() {
        const objJson = {
            id: this.id,
            inicio: this.inicio,
            fim: this.fim,
            servico: { id: this.servico.id },
            funcionario: (this.funcionario) ? { id: this.funcionario.id } : undefined,
            observacoes: this.observacoes,
            pets : this.pets,
            enderecos: this.enderecos,
            cliente: this.cliente
        };

        return objJson;
    }

    toString() {}

}

module.exports = ServicoRealizado;

// TESTES

// const objServReal = {
//     "idEmpresa": 1,
//     "inicio": '2025-10-12T112:45:00',
//     "servico": { "id": 1 },
//     // "funcionario": { "id": 10 },
//     // "estado": {
//     //     "id": "criado"
//     // },
//     // "observacoes": "Observações para o servicoRealizado",
//     "pets" : [
//         {
//             "id": 5,
//             // "alimentacao": "racao",
//             // "remedios": [
//             //     { "id": 10, "nome": "Dipirona", "instrucoes": "depois do almoco" }
//             // ]
//         }
//     ],
//     // "enderecos": [
//     //     {
//     //         "tipo": "buscar",
//     //         "logradouro": "Rua do servicoRealizado",
//     //         "numero": "1234",
//     //         "bairro": "Bairro legal",
//     //         "cidade": "Cidade tal",
//     //         "estado": "ES"
//     //     }
//     // ]
// };
//
// const testeAgend = new ServicoRealizado(objServReal);
// console.log(testeAgend.toJSON());
