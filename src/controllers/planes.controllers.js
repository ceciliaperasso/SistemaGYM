import { asyncHandler } from "../../utils/asyncHandler.js";
import * as planesRepository from "../repositories/planes.repositories.js"

export const listarPlanes = asyncHandler( async(req, res) => {
    const {rows} = await planesRepository.selectPlanes();
    return res.json(rows);
});

export const verPlan = asyncHandler( async(req, res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) {
        return res.status(400).json({mensaje: "El id es invalido, debe ser un número."})
    }

    const {rows} = await planesRepository.selectPlan(id);
    if (rows.length === 0 ) {
        return res.status(404).json(
            {mensaje: "No existe este plan."}
        )
    };

    return res.json(rows[0]);
});

export const agregarPlan = asyncHandler( async(req, res) => {
    const body = req.body;

    //Agregar validaciones ¿?
    const {rows} = await planesRepository.insertPlan(body)

    return res.status(201).json(rows[0])
}); 

export const editarPlan = asyncHandler( async(req, res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) {
        return res.status(400).json({
            mensaje: "El id es invalido, debe ser un número."
        })
    }

    const body = req.body;
    
    const existe = await planesRepository.selectPlan(id);

    if(!existe) {
        return res.status(404).json({
            mensaje: "No exite este plan."
        })
    }

    const {rows} = await planesRepository.insertPlan(body);

    return res.json(rows[0])
});

export const eliminarPlan = asyncHandler( async(req, res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) {
        return res.status(400).json({
            mensaje: "El id es invalido, debe ser un número."
        })
    }

    const existe = await planesRepository.selectPlan(id);

    if(!existe) {
        return res.status(404).json({
            mensaje: "No exite este plan."
        })
    }

    const {rows} = await planesRepository.deletePlan(id);

    return res.json({
        plan: rows[0],
        mensaje: "Plan eliminado correctamente"
    })
});