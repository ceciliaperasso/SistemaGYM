import request from "./client.js";

export function listarAlertas() {
    return request('/alertas');
}

export function registrarNotificacion(idCuota) {
    return request(`/alertas/${idCuota}/notificar`, {
        method: "PATCH"
    });
}