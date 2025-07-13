// env.js
// Recebe as variáveis de ambiente e armazena em variáveis para a aplicação

console.log("[PetAgenda - Backend] Iniciando leitura de variáveis de ambiente...")

const env = {
    BIND_ADDRESS: process.env.BIND_ADDRESS,
    BIND_PORT: process.env.BIND_PORT,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_PASSWORD: process.env.DB_PASSWORD,
    MYSQL_CLIENT_PATH: process.env.MYSQL_CLIENT_PATH,
    SQL_TMP_DIR: process.env.SQL_TMP_DIR,
    SQL_DIR: process.env.SQL_DIR,
    PROFILE_PIC_DIR: process.env.PROFILE_PIC_DIR,
    SERVICO_PIC_DIR: process.env.SERVICO_PIC_DIR,
    HMAC_SECRET: process.env.HMAC_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    IN_PROD: (process.env.NODE_ENV) ? process.env.NODE_ENV == 'production' : false
};

for (const [ key, value ] of Object.entries(env)) {
    console.log(` - ${key} = ${value}`);
}

console.log("[PetAgenda - Backend] Leitura de variáveis de ambiente concluída.")


module.exports = env;


