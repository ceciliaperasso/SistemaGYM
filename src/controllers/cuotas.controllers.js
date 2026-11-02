import { asyncHandler } from "../../utils/asyncHandler.js";
import * as cuotasRepository from "../repositories/cuotas.repositories.js";

export const crearCuota = asyncHandler(async (req, res) => {
    const idSocio = Number(req.body?.id_socios);

    if (!Number.isSafeInteger(idSocio) || idSocio <= 0) {
        return res.status(400).json({
            mensaje: "El id del socio debe ser un número válido."
        });
    }

    const { rows } = await cuotasRepository.insertCuota(idSocio);

    if (rows.length === 0) {
        return res.status(404).json({
            mensaje: "No existe el socio o no tiene un plan asignado."
        });
    }

    return res.status(201).json(rows[0]);
});
