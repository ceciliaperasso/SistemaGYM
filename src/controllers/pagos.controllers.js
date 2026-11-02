import { asyncHandler } from "../../utils/asyncHandler.js"
import * as pagosRepository from "../repositories/pagos.repositories.js"

export const listarPagos = asyncHandler(async(req, res) => {
    const pagos = await pagosRepository.selectPagos();
    const suma = await pagosRepository.sumarPagos();
    const total = await pagosRepository.totalPagos();
    return res.json(
        {total: [total.rows[0], suma.rows[0]],
         pagos: pagos.rows 
        });
}) ;

export const sumarPagos = asyncHandler(async(req, res) => {
    const {rows} = await pagosRepository.sumarPagos();
    return res.json(rows)
})

export const registrarPagoCuota = asyncHandler(async (req, res) => {
    const idCuota = Number(req.params.id);

    if (!Number.isSafeInteger(idCuota) || idCuota <= 0) {
        return res.status(400).json({
            mensaje: "El id de la cuota debe ser un número válido."
        });
    }

    const resultado = await pagosRepository.registrarPagoCuota(idCuota);

    if (resultado.estado === "no_encontrada") {
        return res.status(404).json({ mensaje: "No existe la cuota." });
    }

    if (resultado.estado === "ya_pagada") {
        return res.status(409).json({ mensaje: "La cuota ya está pagada." });
    }

    return res.status(201).json(resultado.pago);
});