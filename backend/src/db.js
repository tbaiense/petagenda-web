const mysql = require('mysql2/promise');
const os = require('node:os');
const fs = require('node:fs/promises');
const fsCb = require('node:fs');
const path = require('node:path');
const shell = require('node:child_process');

// Variáveis de ambiente
const {
    DB_USER,
    DB_HOST,
    DB_PASSWORD,
    SQL_DIR,
    SQL_TMP_DIR,
    MYSQL_CLIENT_PATH
} = require('./envLoader');

if (!MYSQL_CLIENT_PATH) {
    throw new Error("Caminho do executável do cliente do MySQL não foi definido!");
}

const EMPRESA_SCHEMA_BASE_SCRIPT = path.join(SQL_DIR, 'empresa_schema.sql')

// Lendo script de criação de SCHEMA
//let baseScriptContent;
//try {
    //baseScriptContent = fsCb.readFileSync(EMPRESA_SCHEMA_BASE_SCRIPT, {encoding: 'utf8', flag: 'r'});
//} catch (err) {
    //err.message = 'Falha ao ler conteúdo do script base de empresa: ' + err.message;
    //throw err;
//}

const config = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    decimalNumbers: true,
    charset: 'utf8mb4',
    typeCast: function(field, next) {
        if(field.type === 'BIT' && field.length === 1) {
            return (field.string() === '1');
        } else if (field.type === 'DATE' || field.type === 'DATETIME') {
            return field.string();
        } else {
            return next();
        }
    }
};

const dbo = {
    database: 'dbo',
    createConnection: function () {
        return mysql.createConnection({
            database: this.database, 
            ...config
        });
    }
};

const empresa = {
    prefix: 'emp_',
    createSchema: async function (idEmpresa) {
        if (!Number.isInteger(idEmpresa)) {
            throw new TypeError('id de empresa deve ser inteiro para criar schema');
        }

        let newScriptHandle;
        let errorObj;
        const schemaName = `${this.prefix}${idEmpresa}`;
        try {
            const plat = os.platform();
    
            // Alterando arquivo para criar SCHEMA de acordo com ID da empresa
            //const newScriptContent = baseScriptContent.replace(/emp_\?/g, schemaName);

            // Salvando script temporáriamente
            //const EMPRESA_SCHEMA_NEW_SCRIPT = path.join(SQL_TMP_DIR, `${idEmpresa}.sql`);
    
            //newScriptHandle = await fs.open(EMPRESA_SCHEMA_NEW_SCRIPT, 'w');
            //await fs.writeFile(newScriptHandle, newScriptContent);
    
            //newScriptHandle?.close();

            const mysqlPath = MYSQL_CLIENT_PATH ?? 'mysql';
            let cmd;
            if (plat == 'linux') {
                cmd = shell.spawnSync('mysql', ['--defaults-extra-file=/petagenda/sql/client.cnf', '--default-character-set=utf8mb4','-e', `CREATE SCHEMA ${schemaName}; USE ${schemaName}; source ${EMPRESA_SCHEMA_BASE_SCRIPT}`]);
            } else if (plat == 'win32') {
                cmd = shell.spawnSync(mysqlPath, ['--defaults-extra-file=/petagenda/sql/client.cnf', '--default-character-set=utf8mb4', '-e', `CREATE SCHEMA ${schemaName}; USE ${schemaName}; source ${EMPRESA_SCHEMA_BASE_SCRIPT}`]);
            } else {
                throw new Error("Sistema operacional não suportado pelo back-end");
            }
            console.log('cmd', cmd);
            console.log('schemaName', schemaName);
            console.log('EMPRESA_SCHEMA_BASE_SCRIPT', EMPRESA_SCHEMA_BASE_SCRIPT);
            
            //await fs.unlink(EMPRESA_SCHEMA_NEW_SCRIPT);
            if (cmd.status) {
                const msgBuff = cmd.stderr;
                console.log('mensagem de criacao: ', msgBuff.toString());
                // throw new Error(`Falha ao executar cliente MySQL (erro cmd código ${cmd.status}):\n${cmd.stderr}\nVerifique o PATH e tente novamente'`);
            }

        } catch (err) {
            err.message = "Falha ao criar SCHEMA para empresa: " + err.message;
            errorObj = err;
        }
        
        if (errorObj) {
            throw errorObj;
        }

        return schemaName;
    },
    createConnection: async function (empConfig) {
        if (!empConfig) {
            throw new Error('empConfig parameter must be an object containing the id of empresa');
        }

        const { 
            id // id da empresa para encontrar o schema
        } = empConfig;

        if (id == null || id == undefined) {
            throw Error('Empresa não foi definida para conexão');
        }

        if (!Number.isInteger(id)) {
            throw new TypeError('id property of empConfig must be an integer');
        }

        const connConfigs = {
            database: `${this.prefix}${id}`, 
            ...config
        };

        let conn;
        try {
            conn = await mysql.createConnection(connConfigs);
        } catch (err) {
            err.message = "Falha ao conectar com o banco de dados: " + err.message;
            throw err;
        }

        try {
            await conn.execute(`CALL dbo.set_empresa_atual(${id})`);
            return conn;
        } catch (err) {
            conn.end();
            throw err;
        }
    }
};
module.exports = { dbo, empresa };
