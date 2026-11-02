import request from "./client.js";

export function listarPagos() {
    return request('/pagos');
}

export function registrarPagoCuota(idCuota) {
    return request(`/pagos/cuotas/${idCuota}/registrar`, {
        method: "POST"
    });
}