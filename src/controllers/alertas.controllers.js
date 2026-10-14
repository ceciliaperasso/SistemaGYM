import { asyncHandler } from "../../utils/asyncHandler.js";
import * as alertasRepository from "../repositories/alertas.repositories.js"

export const listarAlertas = asyncHandler(async(req, res) => {
    const {rows} = await alertasRepository.selectAlertas();

    return res.json({
        total: rows.length,
        alertas: rows
    });
});

export const resgistrarNotificacion = asyncHandler(async(req,res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) {
        return res.status(400).json({mensaje: "El id es invalido, debe ser un número."})
    }

    const {rows} = await alertasRepository.updateNotificacion(id);

    return res.json({rows})
});