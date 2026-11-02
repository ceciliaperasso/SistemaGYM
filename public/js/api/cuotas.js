import request from "./client.js";

export function crearCuota(idSocio) {
    return request("/cuotas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_socios: Number(idSocio) })
    });
}
