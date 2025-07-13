
const { empresa: empresaDB } = require('../db');
/*
* Modelo de classe para PacoteAgendamento
* JSON:
{
    "id": <INT>,
    "estado": {
        "id": <ENUM("criado", "preparado", "ativo", "concluido", "cancelado")>,
        "nome": ?<VARCHAR(32)>
    },
    "idEmpresa": <INT>,
    "servicoOferecido": {
        "id": <INT>,
        "nome": <VARCHAR>
    },
    "dtInicio": <DATE>,
    "hrAgendada": <TIME>,
    "frequencia": {
        "id": <ENUM("dias_semana", "dias_mes", "dias_ano")>,
        "nome": <VARCHAR>
    },
    "qtdRecorrencia": <INT>,
    "diasPacote": [
        {
            "id": <INT>,
            "dia": <INT>
        }
    ],
    "petsPacote" : [
        {
            "id": <INT>,
            "nome:" <VARCHAR>,
            "dono": {
                "id": <INT>,
                "nome": <VARCHAR>
            },
            "especie": {
                "id": <INT>,
                "nome": <VARCHAR>
            },
        }
    ]
}
*
*/
class PacoteAgendamento {

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

    #_estado;

    set estado(estado) {
        if (!estado || typeof estado != 'object') {
            this.#_estado = undefined;
        } else {
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
                case 'ativo': {
                    objEstado.nome = "Ativo";
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
                    throw new Error('valor inválido para estado de pacote de agendamento');
                }
            }

            this.#_estado = objEstado;
        }
    }

    get estado() {
        return this.#_estado;
    }

    #_idEmpresa;

    set idEmpresa(idEmpresa) {
        if (!Number.isInteger(idEmpresa)) throw new TypeError('idEmpresa must be an integer');

        this.#_idEmpresa = idEmpresa;
    }

    get idEmpresa() {
        return this.#_idEmpresa;
    }

    #_servicoOferecido;

    set servicoOferecido(servicoOferecido) {
        if (servicoOferecido) {
            if (typeof servicoOferecido !== 'object') throw new TypeError('Informações de servicoOferecido devem ser Object');

            this.#_servicoOferecido = {
                id: servicoOferecido.id,
                nome: servicoOferecido.nome ?? undefined
            };

        } else {
            throw new TypeError('Objeto de servicoOferecido do pacote de agendamento não pode ser nulo');
        }
    }

    get servicoOferecido() {
        return this.#_servicoOferecido;
    }

    #_dtInicio;

    set dtInicio(dtInicio) {
        if (typeof dtInicio != 'string' || dtInicio.length < 8) throw new TypeError('dtInicio value must be a string representing a date');
        // TODO: validar string de data
        this.#_dtInicio = dtInicio;
    }

    get dtInicio() {
        return this.#_dtInicio;
    }

    #_hrAgendada;

    set hrAgendada(hrAgendada) {
        if (typeof hrAgendada != 'string' || hrAgendada.length < 5) throw new TypeError('hrAgendada value must be a string representing a timestamp');
        // TODO: validar string de data
        this.#_hrAgendada = hrAgendada;
    }

    get hrAgendada() {
        return this.#_hrAgendada;
    }

    #_frequencia;

    set frequencia(frequencia) {
        if (!frequencia || typeof frequencia != 'object') {
            throw new TypeError('Frequência de pacote de agendamento deve ser um objeto contendo a frequência para as recorrências');
        }

        const objFrequencia = {
            id: frequencia.id,
        };

        switch (frequencia.id) {
            case 'dias_semana': {
                objFrequencia.nome = "Semanal";
                break;
            }
            case 'dias_mes': {
                objFrequencia.nome = "Mensal";
                break;
            }
            case 'dias_ano': {
                objFrequencia.nome = "Anual";
                break;
            }
            default: {
                throw new Error('valor inválido para frequência de pacoteAgendamento');
            }
        }

        this.#_frequencia = objFrequencia;
    }

    get frequencia() {
        return this.#_frequencia;
    }

    #_qtdRecorrencia;

    set qtdRecorrencia(qtdRecorrencia) {
        if (!Number.isInteger(qtdRecorrencia)) throw new TypeError('qtdRecorrencia must be an integer');

        this.#_qtdRecorrencia = qtdRecorrencia;
    }

    get qtdRecorrencia() {
        return this.#_qtdRecorrencia;
    }

    #_diasPacote;

    set diasPacote(diasPacote) {
        if (!diasPacote || !(diasPacote instanceof Array)) {
            throw new Error('Pelo menos um dia deve ser definido para o pacote de agendamento');
        }

        this.#_diasPacote = diasPacote.map( diaPac => {
            if (Number.isInteger(diaPac.dia)) {
                const objDia = {
                    id: diaPac.id ?? undefined,
                    dia: diaPac.dia
                };

                return objDia;
            } else {
                throw new TypeError('os dias do pacote devem ser números inteiros');
            }
        });
    }

    get diasPacote() {
        return this.#_diasPacote;
    }

    #_petsPacote;

    set petsPacote(petsPacote) {
        if (!petsPacote || !(petsPacote instanceof Array)) {
            throw new Error('petsPacote must be an array containing Pet objects');
        }

        this.#_petsPacote = petsPacote.map( pet => {
            if (!Number.isInteger(pet.id)) {
                throw new TypeError('petsPacote contain objects that do not have a valid id value: must be integer');
            }
            const objPet = {
                id: pet.id,
                nome: pet.nome ?? undefined,
                dono: (pet.dono?.id) ? { id: pet.dono.id, nome: pet.dono.nome ?? undefined } : undefined,
                especie: (pet.especie?.id) ? { id: pet.especie.id, nome: pet.especie.nome ?? undefined } : undefined
            };

            return objPet;
        });

    }

    get petsPacote() {
        return this.#_petsPacote;
    }

    constructor(pacoteAgendamento) {
        if (!pacoteAgendamento || typeof pacoteAgendamento != 'object') {
            throw new TypeError('parâmetro de pacoteAgendamento para construtor deve ser um objeto contendo as informações necessárias');
        }

        const {
            id,
            estado,
            idEmpresa,
            servicoOferecido,
            dtInicio,
            hrAgendada,
            frequencia,
            qtdRecorrencia,
            diasPacote,
            petsPacote,
        } = pacoteAgendamento;

        this.id = id;
        this.estado = estado;
        this.idEmpresa = idEmpresa;
        this.servicoOferecido = servicoOferecido;
        this.dtInicio = dtInicio;
        this.hrAgendada = hrAgendada;
        this.frequencia = frequencia;
        this.qtdRecorrencia = qtdRecorrencia;
        this.diasPacote = diasPacote;
        this.petsPacote = petsPacote;
    }

    async save(connParam) {
        if (connParam && typeof connParam != 'object') {
            throw new TypeError('Parâmetro de conexão é inválido para função de salvamento de pacoteAgendamento');
        }

        const conn = (connParam) ? connParam : await empresaDB.createConnection({ id: this.idEmpresa });
        try {
            const objPac = {
                id: this.id,
                dtInicio: this.dtInicio,
                hrAgendada: this.hrAgendada,
                servicoOferecido: this.servicoOferecido.id,
                frequencia: this.frequencia?.id,
                qtdRecorrencia: this.qtdRecorrencia,
                diasPacote: this.diasPacote,
                petsPacote : this.petsPacote?.map( pet => {
                    return { pet: pet.id };
                })
            };

            const json = JSON.stringify(objPac);
            let idResponse;
            if (this.isNew) {
                const [ results ] = await conn.execute(
                    'CALL pacote_agend("insert", ?)',
                    [json]
                );

                idResponse = results[0][0].id_pacote_agendamento;
                this.id = idResponse;
            } else {
                const [ results ] = await conn.execute(
                    'CALL pacote_agend("update", ?)',
                    [json]
                );
                idResponse = this.id;
            }

            if (!connParam) conn?.end();
            return idResponse;
        } catch (err) {
            if (!connParam) conn?.end();

            err.message = "Falha ao atualizar ou cadastrar pacoteAgendamento: " + err.message;
            throw err;
        }
    }

    async saveEstado(connParam) {
        if (connParam && typeof connParam != 'object') {
            throw new TypeError('Parâmetro de conexão é inválido para função de salvamento de pacoteAgendamento');
        }

        const conn = (connParam) ? connParam : await empresaDB.createConnection({ id: this.idEmpresa });
        try {
            let idResponse;
            if (!this.isNew) {
                await conn.execute(
                    'CALL set_estado_pacote_agend(?, ?)',
                    [this.estado.id, this.id]
                );

                idResponse = this.id;
            } else {
                throw new Error('Não é possível salvar o estado de um pacoteAgendamento ainda não cadastrado');
            }

            if (!connParam) conn?.end();
            return idResponse;
        } catch (err) {
            if (!connParam) conn?.end();

            err.message = "Falha ao atualizar estado de pacoteAgendamento: " + err.message;
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
                options.useClass = true;
            }
        }

        const { id, idEmpresa } = filter; // Object representando o PacoteAgendamento
        const { limit, page, useClass } = options;

        // Buscar no banco pacoteAgendamentos
        let pacList = [];
        const conn = await empresaDB.createConnection({ id: idEmpresa });
        try {
            if (Number.isInteger(id)) {
                const [ results ] = await conn.execute(
                    'SELECT '
                        +'p.id AS id_pacote_agendamento, p.id_servico_oferecido, s.nome AS nome_servico_oferecido, p.dt_inicio, p.hr_agendada, p.frequencia, p.estado, p.qtd_recorrencia '
                    + 'FROM `pacote_agend` AS p INNER JOIN servico_oferecido AS s ON (s.id = p.id_servico_oferecido) '
                    + 'WHERE p.id = ? LIMIT 1',
                    [id]
                );
                if (results.length > 0) {
                    let objPac = PacoteAgendamento.fromResultSet(results[0]);

                    pacList = [ objPac ];
                }
            } else { // Buscar vários PacoteAgendamentos
                const [ results ] = await conn.execute(
                    'SELECT '
                        + 'p.id AS id_pacote_agendamento, p.id_servico_oferecido, s.nome AS nome_servico_oferecido, p.dt_inicio, p.hr_agendada, p.frequencia, p.estado, p.qtd_recorrencia '
                    + 'FROM `pacote_agend` AS p INNER JOIN servico_oferecido AS s ON (s.id = p.id_servico_oferecido) '
                    + `ORDER BY p.id DESC LIMIT ${limit} OFFSET ${limit * page}`
                );

                if (results.length > 0) {
                    pacList = results.map( emp => {
                        let objPac = PacoteAgendamento.fromResultSet(emp);

                        return objPac;
                    });
                }
            }
            // anexar pets e dias ao objeto de resposta
            if (pacList.length > 0) {
                const idList = pacList.map( pac => {
                    return pac.id;
                });

                const idListStr = idList.join(",");

                let [ diasPac ] = await conn.execute(
                    `SELECT * FROM dia_pacote WHERE id_pacote_agend IN (${idListStr})`
                );

                if (!diasPac) {
                    throw new Error('Falha ao obter registros de dias para um ou mais pacotes de agendamento');
                }

                let [ petsPac ] = await conn.execute(
                    `SELECT * FROM vw_pet_pacote WHERE id_pacote_agend IN (${idListStr})`
                );

                if (!petsPac) {
                    throw new Error('Falha ao obter registros de pets para um ou mais  pacotes de agendamento');
                }

                pacList = pacList.map( pac => {
                    pac.diasPacote = [];
                    pac.petsPacote = [];

                    diasPac = diasPac.flatMap( diaPac => {
                        if (diaPac.id_pacote_agend == pac.id) {
                            pac.diasPacote.push({
                                id: diaPac.id,
                                dia: diaPac.dia
                            });

                            return [];
                        } else {
                            return diaPac;
                        }
                    });

                    petsPac = petsPac.flatMap( pet => {
                        if (pet.id_pacote_agend == pac.id) {
                            pac.petsPacote.push({
                                id: pet.id_pet,
                                nome: pet.nome,
                                dono: (pet.id_cliente != null && pet.id_cliente != undefined)  ? { id: pet.id_cliente, nome: pet.nome_cliente } : undefined,
                                especie: (pet.id_especie != null && pet.id_especie != undefined) ? { id: pet.id_especie, nome: pet.nome_especie } : undefined
                            });

                            return [];
                        } else {
                            return pet;
                        }
                    });

                    if (useClass) {
                        pac.idEmpresa = idEmpresa;
                        pac = new PacoteAgendamento(pac);
                    }

                    return pac;
                });
            }

            conn.end();
            return pacList;
        } catch (err) {
            err.message = "Falha ao buscar registros de PacoteAgendamentos: " + err.message;
            conn.end();
            throw err;
        }
    }

    static fromResultSet(rs) {
        const objPac = {
            "id": rs.id_pacote_agendamento,
            "estado": {
                "id": rs.estado
            },
            "servicoOferecido": {
                "id": rs.id_servico_oferecido,
                "nome": rs.nome_servico_oferecido
            },
            "dtInicio": rs.dt_inicio,
            "hrAgendada": rs.hr_agendada,
            "frequencia": {
                "id": rs.frequencia
            },
            "qtdRecorrencia": rs.qtd_recorrencia
        };

        return objPac;
    }

    toJSON() {
        const objJson = {
            id: this.id ?? undefined,
            estado:(this.estado?.id) ? this.estado : undefined,
            servicoOferecido: {
                id: this.servicoOferecido.id,
                nome: this.servicoOferecido.nome ?? undefined
            },
            dtInicio: this.dtInicio,
            hrAgendada: this.hrAgendada,
            frequencia: {
                id: this.frequencia.id,
                nome: this.frequencia.nome ?? undefined
            },
            qtdRecorrencia: this.qtdRecorrencia,
            diasPacote: (this.diasPacote?.length > 0) ? this.diasPacote : undefined,
            petsPacote: (this.petsPacote?.length > 0) ? this.petsPacote : undefined
        };

        return objJson;
    }

    toString() {}

}

module.exports = PacoteAgendamento;


// TESTES
/*
async function buscar() {
    const [ found ] = await PacoteAgendamento.find({ id: 3, idEmpresa: 1 });
    console.log(found.toJSON());
}

buscar();*/
