import { useAuth } from "./contexts/UserContext";

const URL = 'http://localhost:3000';

const { validar, getEmpresa, getToken } = useAuth();

function deveRodar() {
    if (!validar) {
        const msg = 'Operação não permitida em modo de desenvolvimento (sem back-end)';
        alert(msg);

        throw Error(msg);
    }
}

function apiFetch(path, opts) {
    deveRodar();
    const urlFinal = `${URL}${path}`;

    // Sobre escrevendo opts
    if (!opts) {
        opts = {
            method: "GET"
        };
    };

    opts.headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };

    return fetch(urlFinal, opts);
}

function empresaFetch(path, opts) {
    deveRodar();

    const urlFinal = `/empresa/${getEmpresa().id}${path}`;
    return apiFetch(path, opts);
}

export { URL, apiFetch, empresaFetch };
