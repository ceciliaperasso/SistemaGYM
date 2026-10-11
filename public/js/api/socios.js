import request from "./client.js";

export function listarSocios() {
    return request('/socios');
}

export function buscarSociosPorTexto(texto) {
    return request(`/socios/buscar?q=${encodeURIComponent(texto)}`);
}

export function buscarSocioPorId(id) {
    return request(`/socios/${id}`)
}