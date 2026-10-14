import { asyncHandler } from "../../utils/asyncHandler.js";
import * as socioRepository from "../repositories/socios.repositories.js";
import { pool } from "../../config/db.js";

export const listarSocios = asyncHandler( async (req, res)=> {
    const {rows} = await pool.query(socioRepository.listaSocios);
    res.json(rows);
}); 

export const buscarSociosPorTexto = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.status(400).json({
            mensaje: "Ingresa un término de búsqueda."
        });
    }

    const socios = await socioRepository.buscarPorTexto(q);

    res.json(socios);
});

export const buscarSocios = asyncHandler( async (req, res)=> {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) {
        return res.status(400).json({mensaje: "El id es invalido, debe ser un número."})
    }

    const resultadoSocio = await pool.query(socioRepository.consultaSocio, [id])
    if (resultadoSocio.rows.length === 0){
        return res.status(404).json({mensaje: "No existe este socio."})
    };

    const resultadoCuotas = await pool.query(socioRepository.consultaCuotas, [id]);

    const resultadoPagos = await pool.query(socioRepository.consultaPagos, [id]);

    res.json({
        perfil: resultadoSocio.rows[0],
        cuotas: resultadoCuotas.rows.length > 0
            ? resultadoCuotas.rows
            : [],

        mensajeCuotas: resultadoCuotas.rows.length === 0
            ? "Este socio todavía no tiene cuotas."
            : null,
        pagos: resultadoPagos.rows.length > 0
            ? resultadoPagos.rows
            : [],

        mensajePagos: resultadoPagos.rows.length === 0
            ? "Este socio todavía no tiene pagos."
            : null
    });
}); 

export const agregarSocio = asyncHandler(async (req, res) => {
    const body = req.body;
    const existe = await pool.query('SELECT * FROM socios WHERE dni = $1', [body.dni])
    const result = existe.rowCount;
    if (result > 0) {
        return res.status(409).json({
            errores: {mensaje: "Ya existe un socio con este DNI"}
        });
    }

    const { rows } = await socioRepository.insertSocio(body);

    return res.json(rows[0])


});

export const editarSocio = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const body = req.body;
    if (Number.isNaN(id)) {
        return res.status(400).json({mensaje: "El id debe ser un numero."});
    }

    const existe = await socioRepository.existeSocio(id);
    if (!existe) {
        return res.status(404).json({mensaje: "No existe este socio"});
    }

    const dniDuplicado = await socioRepository.dniDuplicado(body.dni, id);
    if (dniDuplicado) {
      return res.status(409).json({
        errores: { dni: 'El DNI ya pertenece a otro socio' }
      });
    }

    const socio = await socioRepository.actualizarSocio(id, body);
    return res.json(socio);

});

export const eliminarSocio = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) {
        return res.status(400).json({mensaje: "El id es invalido, debe ser un número."})
    }

    const rows = await socioRepository.eliminarSocio(id);
    
    if (rows.length === 0) {
        return res.status(404).send("mensaje: No exite este plan")
    }
    return res.json({
        socio: rows[0],
        mensaje: "Socio eliminado correctamente"
    })
});