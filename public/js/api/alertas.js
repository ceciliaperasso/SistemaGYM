import request from "./client.js";

export function listarAlertas() {
    return request('/alertas');
}