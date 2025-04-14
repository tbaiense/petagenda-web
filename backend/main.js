import http from "node:http";
import { Buffer } from "node:buffer";
import mysqlx from "@mysql/xdevapi";

const dbConfig = {
    password: process.env.DB_PASS,
    user: "root",
    host: "localhost",
    port: 33060,
    schema: "dbo",
};

const app = http.createServer((req, res) => {
    const path = req.url;
    const method = req.method;
    const contentType = req.headers['content-type'];

    if (path == '/cadastro') {
        if (method == "POST") {
            const bufferArray = [];
            let body;

            req.on('data', chunk => {
                bufferArray.push(chunk);
            })

            if (contentType == "application/x-www-form-urlencoded") {
                req.on('end', () => {
                    body = Buffer.concat(bufferArray).toString();

                    const params = new URLSearchParams(body);

                    console.log(params);
                    console.log(dbConfig);

                    const usr = {
                        email: params.get("email"),
                        senha: params.get("senha"),
                        perguntaSeguranca: {
                            pergunta: params.get("perg-seg"),
                            resposta: params.get("resp-seg")
                        }
                    }

                    const usrJson = JSON.stringify(usr);

                    mysqlx.getSession(dbConfig)
                        .then(session => {
                            return session.startTransaction()
                                .then(() => {
                                    return session.sql(`CALL usuario('insert', '${usrJson}')`)
                                        .execute();
                                })
                                .then(result => {
                                    console.log(result.fetchOne());
                                    return session.commit();
                                })
                                .catch(err => {
                                    console.log(err.info.msg);
                                    return session.rollback();
                                })
                                .then(() => {
                                    res.write("sucess");
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "text/plain");

                                    res.end();
                                });
                        });
                });
            } else {
                res.statusCode = 400;
                res.end();
            }

        }
    } else {
        res.statusCode = 404;
        res.end();
    }

});

app.listen(8080, '127.0.0.1');
