import request from "./client.js";

export function listarPlanes() {
    return request('/planes');
}