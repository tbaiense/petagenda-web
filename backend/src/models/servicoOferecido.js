const { empresa: empresaDB } = require('../db');

/*
MODELO DE CLASSE PARA SERVIÇO OFERECIDO

Modelo JSON:
{   
    "id": <INT>,
    "idEmpresa": <INT>,
    "nome": <VARCHAR(64)>,
    "categoria": <INT>,
    "nomeCategoria": <VARCHAR>
    "preco": <DECIMAL(8,2)>,
    "tipoPreco": <ENUM("pet", "servico")>,  <-- forma de cobrança do preço
    "descricao": ?<TEXT>,
    "foto": ?<TEXT>,   <-- caminho de arquivo "/caminho/image.png"
    "restricaoParticipante": <ENUM("coletivo", "individual")>,
    "restricaoEspecie": ?[
        +{
            "especie": <INT>  <-- PK da tabela "especie",
            "nomeEspecie": <varchar>
        }
    ]
}
*/
class ServicoOferecido {
    static fromResultSet(rs) {
        const servObj = {
            id: rs.id_servico_oferecido,
            nome: rs.nome,
            categoria: rs.id_categoria,
            nomeCategoria: rs.nome_categoria,
            preco: rs.preco,
            tipoPreco: rs.tipo_preco,
            descricao: (rs.descricao) ? rs.descricao : undefined,
            foto: (rs.foto) ? rs.foto : undefined,
            restricaoParticipante: rs.restricao_participante
        };

        return servObj;
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
            options = { limit: 1000, page: 0, useClass: false };
        }

        const { id, idEmpresa } = filter; // Object representando a servicoOferecido
        const { limit, page, useClass } = options;

        // Buscar no banco servicos oferecidos
        let servicoList = [];
        const conn = await empresaDB.createConnection({ id: idEmpresa });
        let qtdServicosOferecidos = 0;
        try {
            if (Number.isInteger(id)) { 
                const [ results ] = await conn.execute(
                    `SELECT * FROM vw_servico_oferecido WHERE id_servico_oferecido = ? LIMIT 1`,
                    [id]
                );

                if (results.length > 0) {
                    qtdServicosOferecidos = results[0].qtd_servicos_oferecidos;
                    const objServ = ServicoOferecido.fromResultSet(results[0]);
                    servicoList = [ useClass ? new ServicoOferecido(objServ) : objServ ];          
                }
            } else { // Buscar várias ServicoOferecidos
                const [ results ] = await conn.execute(
                    `SELECT * FROM vw_servico_oferecido ORDER BY id_servico_oferecido DESC LIMIT ${limit} OFFSET ${limit * page}`/* LIMIT ${limit} OFFSET ${limit * page}`*/
                );

                if (results.length > 0) {
                    qtdServicosOferecidos = results[0].qtd_servicos_oferecidos;

                    servicoList = results.map( emp => {
                        const objServ = ServicoOferecido.fromResultSet(emp);
    
                        return useClass ? new ServicoOferecido(objServ) : objServ;
                    });      
                }
            }
            // anexar restricaoEspecie ao objeto de resposta
            if (servicoList.length > 0) {
                const idList = servicoList.map( serv => {
                    return serv.id;
                });

                const idListStr = idList.join(",");
                const [ restricoesEspecie ] = await conn.execute( // NESTE MOMENTO -- APENAS NESTE MOMENTO --, EU AMO JAVASCRIPT <3
                    `SELECT * FROM vw_restricao_especie_servico WHERE id_servico_oferecido IN (${idListStr})`
                );

                restricoesEspecie.forEach( res => {
                    const {
                        id_servico_oferecido: id,
                        id_especie: especie,
                        nome_especie: nomeEspecie
                    } = res;

                    const index = servicoList.findIndex( serv => {
                        return serv.id === id;
                    });

                    if (!servicoList[index].restricaoEspecie) {
                        servicoList[index].restricaoEspecie = [];
                    }
                    servicoList[index].restricaoEspecie.push({especie: especie, nomeEspecie: nomeEspecie});
                });
            }
            conn.end();
            return { servicoList, qtdServicosOferecidos };
        } catch (err) {
            err.message = "Falha ao buscar registros de ServicoOferecido: " + err.message; 
            conn.end();
            throw err;
        }
    } 

    constructor(servicoOferecido) {
        if (typeof servicoOferecido != 'object') {
            throw new TypeError('servicoOferecido argument must be an object containing information for servicoOferecido');
        }

        const {
            id,
            idEmpresa,
            nome,
            categoria,
            nomeCategoria,
            preco,
            tipoPreco,
            descricao,
            foto,
            restricaoParticipante,
            restricaoEspecie
        } = servicoOferecido;
        
        this.id = id;
        this.idEmpresa = idEmpresa;
        this.nome = nome;
        this.categoria = categoria;
        this.nomeCategoria = nomeCategoria;
        this.preco = preco;
        this.tipoPreco = tipoPreco;
        this.descricao = descricao;
        this.foto = foto;
        this.restricaoParticipante = restricaoParticipante;
        this.restricaoEspecie = restricaoEspecie;
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

    #_categoria;

    set categoria(categoria) {
        if (Number.isInteger(categoria)) {
            this.#_categoria = categoria;
        } else {
            throw new TypeError('categoria must be an integer');
        }
    }

    get categoria() {
        return this.#_categoria;
    }

    #_nomeCategoria;

    set nomeCategoria(nomeCategoria) {
        if (!nomeCategoria) {
            this.#_nomeCategoria = undefined;
            return;
        } else if (typeof nomeCategoria != 'string' || nomeCategoria.length < 3) {
            throw new TypeError('nomeCategoria value must be a string with at least 3 characters');
        }
        // TODO: validar string de nome
        this.#_nomeCategoria = nomeCategoria;
    }

    get nomeCategoria() {
        return this.#_nomeCategoria;
    }

    #_preco;

    set preco(preco) {
        if (typeof preco != 'number') {
            throw new TypeError('preco value must be a decimal number');
        }

        if (preco < 0 || !Number.isFinite(preco)) {
            throw new Error('preco must be a positive finite number');
        }

        this.#_preco = preco;
    }

    get preco() {
        return this.#_preco;
    }

    #_tipoPreco;

    set tipoPreco(tipoPreco) {
        if (typeof tipoPreco != 'string') throw new TypeError('tipoPreco value must be a string');

        if (tipoPreco == 'pet' || tipoPreco == 'servico') {
            this.#_tipoPreco = tipoPreco;
        } else {
            throw new Error('invalid value for tipoPreco in licenca');
        }
    }

    get tipoPreco() {
        return this.#_tipoPreco;
    }

    #_descricao;

    set descricao(descricao) {
        if (typeof descricao != 'string') {
            if (descricao != null && descricao != undefined) {
                throw new TypeError('descricao value must be a string or undefined or null');
            } else {
                this.#_descricao = undefined;
            }
        } else if ((descricao = descricao.trim()).length == 0) {
            this.#_descricao = undefined;
        } else {
            this.#_descricao = descricao;
        }
    }

    get descricao() {
        return this.#_descricao;
    }

    #_foto;

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

    #_restricaoParticipante;

    set restricaoParticipante(restricaoParticipante) {
        if (typeof restricaoParticipante != 'string') {
            throw new TypeError('restricaoParticipante value must be a string');
        }

        if (restricaoParticipante == 'coletivo' || restricaoParticipante == 'individual') {
            this.#_restricaoParticipante = restricaoParticipante;
        } else {
            throw new Error('invalid value for restricaoParticipante in servicoOferecido');
        }
    }

    get restricaoParticipante() {
        return this.#_restricaoParticipante;
    }

    #_restricaoEspecie;

    set restricaoEspecie(restricaoEspecie) {
        if (!restricaoEspecie) {
            this.#_restricaoEspecie = undefined;
        } else if (restricaoEspecie instanceof Array) {
            this.#_restricaoEspecie = restricaoEspecie.map( restricao => {
                if (Number.isInteger(restricao.especie)) {
                    return { 
                        especie: restricao.especie, 
                        nomeEspecie: (typeof restricao.nomeEspecie == 'string' && restricao.nomeEspecie) ? restricao.nomeEspecie : undefined
                    };
                } else {
                    throw new TypeError('restricaoEspecie contain objects that do not have a valid especie value: must be integer');
                }
            });
        } else {
            throw new Error('restricaoEspecie must be undefined or an array containing especie');
        }
    }

    get restricaoEspecie() {
        return this.#_restricaoEspecie;
    }

    async save() {
        const conn = await empresaDB.createConnection({ id: this.idEmpresa });

        // Criar servicoOferecido
        try {
            const json = JSON.stringify(this);
            let idResponse;
            await conn.query('START TRANSACTION');
            if (this.isNew) {
                const [ results ] = await conn.execute(
                    'CALL servico_oferecido("insert", ?)',
                    [json]
                );
    
                idResponse = results[0][0].id_servico_oferecido;
                this.id = idResponse;
            } else {
                const [ results ] = await conn.execute(
                    'CALL servico_oferecido("update", ?)',
                    [json]
                );
                idResponse = this.id;
            }

            await conn.query('COMMIT');
            conn.end();
            return idResponse;
        } catch (err) {
            await conn.query('ROLLBACK');
            conn.end();
            err.message = "Falha ao cadastrar ou atualizar registro de serviço oferecido: " + err.message;
            throw err;
        }
    }

    toJSON() {
        return {
            id: this.id,
            idEmpresa: this.idEmpresa,
            nome: this.nome,
            categoria: this.categoria,
            nomeCategoria: this.nomeCategoria,
            preco: this.preco,
            tipoPreco: this.tipoPreco,
            descricao: (this.descricao) ? this.descricao : undefined,
            foto: (this.foto) ? this.foto : undefined,
            restricaoParticipante: this.restricaoParticipante,
            restricaoEspecie: this.restricaoEspecie,
        };
    }

    toString() {
        return `${this.nome} (R$ ${this.preco})`;
    }
}

module.exports = ServicoOferecido;
