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

export function agregarSocio(datosSocio){
    return request('/socios', {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(datosSocio)
})
}

export function eliminarSocio(id){
    return request(`/socios/${id}`, {
        method: "DELETE",
    })
}