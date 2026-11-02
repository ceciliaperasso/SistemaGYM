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