import request from "./client.js";

export function listarPagos() {
    return request('/pagos');
}