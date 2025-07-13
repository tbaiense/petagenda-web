const { empresa: empresaDB } = require('../db');
/*
 Modelo de classe para Agendamento
 JSON:
 {
    "id": <INT>,
    "idInfoServico": <INT>,
    "idEmpresa": <INT>,
    "idServicoRealizado": <INT>,
    "dtHrMarcada": <DATETIME>,
    "servico": { "id": <INT> },
    "valor": {
        "servico": <DECIMAL>,
        "pets": <DECIMAL>,
        "total": <DECIMAL>
    }
    "funcionario": { "id": <INT> },
    "estado": {
        "id": <ENUM('criado','preparado','pendente','concluido','cancelado')>,
        "nome": ?<VARCHAR(32)>
    },
    "pacote": {
        "id": <INT>
    },
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

 */
class Agendamento {

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

    #_idServicoRealizado;

    set idServicoRealizado(idServicoRealizado) {
        if (Number.isInteger(idServicoRealizado)) {
            this.#_idServicoRealizado = idServicoRealizado;

        } else if (idServicoRealizado == null || idServicoRealizado == undefined) {
            this.#_idServicoRealizado = undefined;
        } else {
            throw new TypeError('idServicoRealizado must be an integer or null or undefined');
        }
    }

    get idServicoRealizado() {
        return this.#_idServicoRealizado;
    }

    #_idEmpresa;

    set idEmpresa(idEmpresa) {
        if (!Number.isInteger(idEmpresa)) throw new TypeError('idEmpresa must be an integer');

        this.#_idEmpresa = idEmpresa;
    }

    get idEmpresa() {
        return this.#_idEmpresa;
    }


    #_dtHrMarcada;

    set dtHrMarcada(dtHrMarcada) {
        if (typeof dtHrMarcada != 'string' || dtHrMarcada.length < 8) throw new TypeError('dtHrMarcada value must be a string representing a date');
        // TODO: validar string de data
        this.#_dtHrMarcada = dtHrMarcada;
    }

    get dtHrMarcada() {
        return this.#_dtHrMarcada;
    }

    #_servico;

    set servico(servico) {
        if (servico) {
            if (typeof servico !== 'object') throw new TypeError('Informações de servico devem ser Object');

            this.#_servico = {
                ...servico
            };

        } else {
            throw new TypeError('Objeto de servico do pet não pode ser nulo');
        }
    }

    get servico() {
        return this.#_servico;
    }

    #_cliente;

    set cliente(cliente) {
        this.#_cliente = {
            id: cliente.id,
            nome: cliente.nome
        };
    }

    get cliente() {
        return this.#_cliente;
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
        } else if (funcionario == undefined || funcionario == null) {
            this.#_funcionario = undefined;
        } else {
            throw new TypeError('Objeto de funcionario do pet não pode ser nulo');
        }
    }

    #_estado;

    set estado(estado) {
        if (estado && typeof estado == 'object') {

            const objEstado = {
                id: estado.id,
            };

            switch (estado.id) {
                case 'criado': {
                    objEstado.nome = "Criado";
                    break;
                }
                case 'preparado': {
                    objEstado.nome = "Preparado";
                    break;
                }
                case 'pendente': {
                    objEstado.nome = "Pendente";
                    break;
                }
                case 'concluido': {
                    objEstado.nome = "Concluído";
                    break;
                }
                case 'cancelado': {
                    objEstado.nome = "Cancelado";
                    break;
                }
                default: {
                    throw new Error('valor inválido para estado de agendamento');
                }
            }

            this.#_estado = objEstado;
        } else {
            this.#_estado = undefined;
        }
    }

    get estado() {
        return this.#_estado;
    }

    #_pacote;

    set pacote(pacote) {
        if (pacote) {
            if (typeof pacote !== 'object') throw new TypeError('Informações de pacote devem ser Object');

            this.#_pacote = {
                id: pacote.id
            };

        } else {
            throw new TypeError('Objeto de pacote do agendamento não pode ser nulo');
        }
    }

    get pacote() {
        return this.#_pacote;
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
            throw new TypeError('Valor inválido para observacoes de agendamento: deve ser string ou undefined');
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
                    const objAgend = {
                        id: pet.id,
                        alimentacao: (pet.alimentacao) ? pet.alimentacao : undefined
                    };
                    const remedios = pet.remedios;

                    if (remedios && remedios instanceof Array) {
                        objAgend.remedios = remedios.map( remedio => {
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

                    return objAgend;
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
            throw new Error("Não é permitido atribuir mais de dois endereços ao agendamento");
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

    constructor(agendamento) {
        if (!agendamento || typeof agendamento != 'object') {
            throw new TypeError('parâmetro de agendamento para construtor deve ser um objeto contendo as informações necessárias');
        }

        const {
            id,
            idInfoServico,
            idEmpresa,
            dtHrMarcada,
            servico,
            valor,
            funcionario,
            estado,
            observacoes,
            pets,
            enderecos,
        } = agendamento;

        this.id = id;
        this.idInfoServico = idInfoServico;
        this.idEmpresa = idEmpresa;
        this.dtHrMarcada = dtHrMarcada;
        this.servico = servico;
        this.valor = valor;
        this.funcionario = funcionario;
        this.estado = estado;
        this.observacoes = observacoes;
        this.pets = pets;
        this.enderecos = enderecos;

    }

    async save(connParam) {
        if (connParam && typeof connParam != 'object') {
            throw new TypeError('Parâmetro de conexão é inválido para função de salvamento de agendamento');
        }

        const conn = (connParam) ? connParam : await empresaDB.createConnection({ id: this.idEmpresa });
        try {
            const objAgend = {
                id: this.id,
                dtHrMarcada: this.dtHrMarcada,
                info: {
                    servico: this.servico.id,
                    funcionario: this.funcionario?.id,
                    observacoes: this.observacoes,
                    pets : this.pets,
                    enderecos: this.enderecos
                }
            };

            const json = JSON.stringify(objAgend);
            let idResponse;
            if (this.isNew) {
                const [ results ] = await conn.execute(
                    'CALL agendamento("insert", ?)',
                    [json]
                );

                const [ idQueryResult ] = await conn.execute(
                    'SELECT @id_agendamento AS id_agendamento'
                );

                idResponse = idQueryResult[0].id_agendamento;
                this.id = idResponse;
            } else {
                const [ results ] = await conn.execute(
                    'CALL agendamento("update", ?)',
                    [json]
                );
                idResponse = this.id;
            }

            if (!connParam) conn.end();
            return idResponse;
        } catch (err) {
            if (!connParam) conn?.end();

            err.message = "Falha ao atualizar ou cadastrar agendamento: " + err.message;
            throw err;
        }
    }


    async saveEstado(connParam) {
        if (connParam && typeof connParam != 'object') {
            throw new TypeError('Parâmetro de conexão é inválido para função de salvamento de agendamento');
        }

        const conn = (connParam) ? connParam : await empresaDB.createConnection({ id: this.idEmpresa });
        try {
            let idResponse;
            if (!this.isNew) {
                await conn.execute(
                    'CALL set_estado_agendamento(?, ?)',
                    [this.estado.id, this.id]
                );

                idResponse = this.id;
            } else {
                throw new Error('Não é possível salvar o estado de um agendamento ainda não cadastrado');
            }

            if (!connParam) conn?.end();
            return idResponse;
        } catch (err) {
            if (!connParam) conn?.end();

            err.message = "Falha ao atualizar estado de agendamento: " + err.message;
            throw err;
        }
    }

    async saveFuncionario(connParam) {
        if (connParam && typeof connParam != 'object') {
            throw new TypeError('Parâmetro de conexão é inválido para função de salvamento de agendamento');
        }

        const conn = (connParam) ? connParam : await empresaDB.createConnection({ id: this.idEmpresa });
        try {
            let idResponse;
            if (!this.isNew) {
                await conn.execute(
                    'CALL set_funcionario_info_servico(?, ?)',
                                   [this.funcionario.id, this.idInfoServico]
                );

                idResponse = this.id;
            } else {
                throw new Error('Não é possível salvar o funcionário atribuído de um agendamento ainda não cadastrado');
            }

            if (!connParam) conn?.end();
            return idResponse;
        } catch (err) {
            if (!connParam) conn?.end();

            err.message = "Falha ao atualizar funcionário atribuído de agendamento: " + err.message;
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
            options = { limit: 10, page: 0, useClass: false };
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

        const { id, idEmpresa } = filter; // Object representando o Agendamento
        const { limit, page, useClass, ordenacao } = options;

        // Buscar no banco agendamentos
        let agendList = [];
        const conn = await empresaDB.createConnection({ id: idEmpresa });
        let qtdAgendamentos = 0;

        try {
            if (Number.isInteger(id)) {
                const [ results ] = await conn.execute(
                    'SELECT * FROM `vw_agendamento` WHERE `id_agendamento` = ? LIMIT 1',
                    [id]
                );
                if (results.length > 0) {
                    let objAgend = Agendamento.fromResultSet(results[0]);
                    qtdAgendamentos = results[0].qtd_agendamento;
                    if (useClass) {
                        objAgend.idEmpresa = idEmpresa;
                        objAgend = new Agendamento(objAgend);
                    }
                    agendList = [ objAgend ];
                }
            } else { // Buscar vários Agendamentos
                let sql, params;
                if (filter.query) {
                    let filterSQL = '';

                    let orderSQL = 'id_agendamento DESC';

                    switch (filter.option) {
                        case 'cliente': {
                            filterSQL += `nome_cliente LIKE '%${filter.query}%' `;

                            orderSQL = `nome_cliente ${(options.ordenacao == 'ascending') ? 'ASC' : 'DESC'} `
                        }
                        default: {}
                    }

                    if (filter.estado) {
                        filterSQL += `${(filter.option) ? 'AND' : ''} estado = '${filter.estado}'`;
                    }

                    sql = 'SELECT '
                            + "COUNT(a.id) OVER() AS qtd_agendamento, "
                            + "a.id AS id_agendamento, "
                            + "a.dt_hr_marcada AS dt_hr_marcada, "
                            + "a.estado AS estado, "
                            + "a.id_pacote_agend AS id_pacote_agend, "
                            + "a.valor_servico AS valor_servico, "
                            + "a.valor_total AS valor_total, "
                            + "a.id_servico_realizado AS id_servico_realizado, "
                            + "i_s.* "
                        + "FROM agendamento AS a "
                        + "INNER JOIN vw_info_servico AS i_s ON (i_s.id_info_servico = a.id_info_servico) "
                        + `WHERE ${filterSQL} ORDER BY ${orderSQL} `
                        + `LIMIT ${limit} OFFSET ${limit * page}`;

                } else {
                    sql = `SELECT * FROM vw_agendamento ORDER BY id_agendamento DESC LIMIT ${limit} OFFSET ${limit * page}`;
                }

                const [ results ] = await conn.execute(sql);

                if (results.length > 0) {
                    qtdAgendamentos = results[0].qtd_agendamento;
                    agendList = results.map( emp => {
                        let objAgend = Agendamento.fromResultSet(emp);

                        if (useClass) {
                            objAgend.idEmpresa = idEmpresa;
                            objAgend = new Agendamento(objAgend);
                        }

                        return objAgend;
                    });
                }
            }
            // anexar pets ao objeto de resposta
            if (agendList.length > 0) {
                const idList = agendList.map( agend => {
                    return agend.idInfoServico;
                });

                const idListStr = idList.join(",");
                const [ petServ ] = await conn.execute(
                `SELECT id_pet_servico, id_pet, instrucao_alimentacao, id_info_servico FROM vw_pet_servico WHERE id_info_servico IN (${idListStr})`
                );

                if (!petServ) {
                    throw new Error('Falha ao obter registros de pets para agendamento');
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

                agendList = agendList.map( agend => {
                    agend.pets = [];

                    petServList = petServList.flatMap( pet => {
                        if (pet.idInfoServico == agend.idInfoServico) {
                            agend.pets.push({
                                id: pet.id,
                                instrucaoAlim: pet.instrucaoAlim ?? undefined,
                                remedios: (pet.remedios?.length > 0) ? pet.remedios : undefined
                            });

                            return [];
                        } else {
                            return pet;
                        }
                    });

                    return agend;
                });
            }

            conn.end();
            return [qtdAgendamentos, agendList];
        } catch (err) {
            err.message = "Falha ao buscar registros de Agendamentos: " + err.message;
            conn.end();
            throw err;
        }
    }

    static fromResultSet(rs) {
        const objAgend = {
            "id": rs.id_agendamento,
            "idInfoServico": rs.id_info_servico,
            "idServicoRealizado": rs.id_servico_realizado ?? undefined,
            "dtHrMarcada": rs.dt_hr_marcada,
            "servico": {
                "id": rs.id_servico_oferecido,
                "nome": rs.nome_servico_oferecido,
                "categoria": rs.id_categoria_servico_oferecido,
                "nomeCategoria": rs.nome_categoria_servico
            },
            "cliente": {
                "id": rs.id_cliente,
                "nome": rs.nome_cliente
            },
            "valor": {
                "servico": rs.valor_servico ?? 0,
                "pets": (!rs.valor_servico && rs.valor_total) ? rs.valor_total : 0,
                "total": rs.valor_total ?? 0
            },
            "funcionario": (rs.id_funcionario) ? {
                "id": rs.id_funcionario,
                "nome": rs.nome_funcionario

            } : undefined,
            "estado": { "id": rs.estado },
            "pacote": (rs.id_pacote_agend) ? { id: rs.id_pacote_agend } : undefined,
            "observacoes": (rs.observacoes) ? rs.observacoes : undefined
        };

        if (rs.tipo_endereco_buscar != rs.tipo_endereco_devolver) {
            objAgend.enderecos = [];
            if (rs.tipo_endereco_buscar) {
                objAgend.enderecos.push({
                    "tipo": rs.tipo_endereco_buscar,
                    "logradouro": rs.logradouro_endereco_buscar,
                    "numero": rs.numero_endereco_buscar,
                    "bairro": rs.bairro_endereco_buscar,
                    "cidade": rs.cidade_endereco_buscar,
                    "estado": rs.estado_endereco_buscar
                });
            }

            if (rs.tipo_endereco_devolver) {
                objAgend.enderecos.push({
                    "tipo": rs.tipo_endereco_devolver,
                    "logradouro": rs.logradouro_endereco_devolver,
                    "numero": rs.numero_endereco_devolver,
                    "bairro": rs.bairro_endereco_devolver,
                    "cidade": rs.cidade_endereco_devolver,
                    "estado": rs.estado_endereco_devolver
                });
            }

            if (!objAgend.enderecos) {
                objAgend.enderecos = undefined;
            }

        } else if (rs.tipo_endereco_buscar) {
            objAgend.enderecos = [{
                "tipo": rs.tipo_endereco_buscar,
                "logradouro": rs.logradouro_endereco_buscar,
                "numero": rs.numero_endereco_buscar,
                "bairro": rs.bairro_endereco_buscar,
                "cidade": rs.cidade_endereco_buscar,
                "estado": rs.estado_endereco_buscar
            }];
        }
        return objAgend;
    }

    toJSON() {
        const objJson = {
            id: this.id,
            idServicoRealizado: this.idServicoRealizado ?? undefined,
            dtHrMarcada: this.dtHrMarcada,
            servico: { id: this.servico.id },
            cliente: (this.cliente) ? { id: this.cliente.id, nome: this.cliente.nome } : undefined,
            funcionario: (this.funcionario) ? { id: this.funcionario.id } : undefined,
            estado: (this.estado) ? this.estado : undefined,
            pacote: this.pacote,
            observacoes: this.observacoes,
            pets : this.pets,
            enderecos: this.enderecos
        };

        return objJson;
    }

    toString() {}

}

module.exports = Agendamento;
