import { pool } from "../../config/db.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const listarSocios = asyncHandler( async (req, res)=> {
    const {rows} = await pool.query(
        `WITH cuotas_saldo AS (
            SELECT
                c.id_cuota,
                c.id_socios,
                c.fecha_emision,
                c.vencimiento,
                c.monto,
                GREATEST(
                    c.monto - COALESCE(SUM(dp.monto_aplicado), 0),
                    0
                ) AS saldo
            FROM cuotas c
            LEFT JOIN detalle_pago dp
                ON dp.id_cuota = c.id_cuota
            GROUP BY
                c.id_cuota,
                c.id_socios,
                c.fecha_emision,
                c.vencimiento,
                c.monto
        ),
        ultima_cuota AS (
            SELECT DISTINCT ON (id_socios)
                id_cuota,
                id_socios,
                vencimiento,
                saldo
            FROM cuotas_saldo
            ORDER BY
                id_socios,
                fecha_emision DESC,
                id_cuota DESC
        )
        SELECT
            s.id_socios,
            s.nombre,
            s.apellido,
            s.dni,
            pl.dias AS nombre_plan,
            TO_CHAR(COALESCE(uc.saldo, 0), 'FM999G999G999G990') AS monto_a_pagar,
            uc.vencimiento,
            CASE
                WHEN uc.id_cuota IS NULL THEN 'Sin cuota'
                WHEN uc.saldo <= 0 THEN 'Pagada'
                WHEN uc.vencimiento < CURRENT_DATE THEN 'Vencida'
                WHEN uc.vencimiento <= CURRENT_DATE + 5
                    THEN 'Próxima a vencer'
                ELSE 'Al día'
            END AS estado_cuota
        FROM socios s
        LEFT JOIN planes pl
            ON pl.id_plan = s.id_plan
        LEFT JOIN ultima_cuota uc
            ON uc.id_socios = s.id_socios
        ORDER BY s.apellido, s.nombre;`);
    res.json(rows);
}); 

export const buscarSociosPorTexto = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.status(400).json({
            mensaje: "Ingresa un término de búsqueda."
        });
    }

    const palabras = q.trim().split(/\s+/);

    const condiciones = palabras.map((_, i) =>
        `(s.nombre ILIKE $${i + 1} OR s.apellido ILIKE $${i + 1})`
    ).join(" AND ");

    const valores = palabras.map(palabra => `%${palabra}%`);

    const { rows } = await pool.query(
        `WITH cuotas_saldo AS (
            SELECT
                c.id_cuota,
                c.id_socios,
                c.fecha_emision,
                c.vencimiento,
                c.monto,
                GREATEST(
                    c.monto - COALESCE(SUM(dp.monto_aplicado), 0),
                    0
                ) AS saldo
            FROM cuotas c
            LEFT JOIN detalle_pago dp
                ON dp.id_cuota = c.id_cuota
            GROUP BY
                c.id_cuota,
                c.id_socios,
                c.fecha_emision,
                c.vencimiento,
                c.monto
        ),
        ultima_cuota AS (
            SELECT DISTINCT ON (id_socios)
                id_cuota,
                id_socios,
                vencimiento,
                saldo
            FROM cuotas_saldo
            ORDER BY
                id_socios,
                fecha_emision DESC,
                id_cuota DESC
        )
        SELECT
            s.id_socios,
            s.nombre,
            s.apellido,
            s.dni,
            pl.dias AS nombre_plan,
            TO_CHAR(
                COALESCE(uc.saldo, 0),
                'FM999G999G999G990'
            ) AS monto_a_pagar,
            uc.vencimiento,
            CASE
                WHEN uc.id_cuota IS NULL THEN 'Sin cuota'
                WHEN uc.saldo <= 0 THEN 'Pagada'
                WHEN uc.vencimiento < CURRENT_DATE THEN 'Vencida'
                WHEN uc.vencimiento <= CURRENT_DATE + 5
                    THEN 'Próxima a vencer'
                ELSE 'Al día'
            END AS estado_cuota
        FROM socios s
        JOIN planes pl
            ON pl.id_plan = s.id_plan
        LEFT JOIN ultima_cuota uc
            ON uc.id_socios = s.id_socios
        WHERE s.activo = TRUE
            AND ${condiciones}
        ORDER BY s.apellido, s.nombre
        LIMIT 20`,
        valores
    );

    res.json(rows);
});

export const buscarSocios = asyncHandler( async (req, res)=> {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) {
        return res.status(400).json({mensaje: "El id es invalido, debe ser un número."})
    }

    const consultaSocio = `SELECT
            s.id_socios,
            s.nombre,
            s.apellido,
            s.dni,
            s.fecha_nacimiento,
            s.telefono,
            s.redes,
            s.email,
            s.fecha_alta,
            s.activo,
            pl.dias AS plan_dias,
            pl.precio AS plan_precio
        FROM socios s
        JOIN planes pl
            ON pl.id_plan = s.id_plan
        WHERE s.id_socios = $1;`
    
    const consultaCuotas = `
        SELECT
            c.id_cuota,
            c.fecha_emision,
            c.fecha_ult_rec,
            c.vencimiento,
            c.monto AS monto_original,
            COALESCE(SUM(dp.monto_aplicado), 0) AS monto_pagado,
            GREATEST(
                c.monto - COALESCE(SUM(dp.monto_aplicado), 0),
                0
            ) AS saldo,
            CASE
                WHEN GREATEST(
                    c.monto - COALESCE(SUM(dp.monto_aplicado), 0),
                    0
                ) <= 0 THEN 'Pagada'
                WHEN c.vencimiento < CURRENT_DATE
                    THEN 'Vencida'
                WHEN c.vencimiento <= CURRENT_DATE + 5
                    THEN 'Próxima a vencer'
                ELSE 'Al día'
            END AS estado_cuota
        FROM cuotas c
        LEFT JOIN detalle_pago dp
            ON dp.id_cuota = c.id_cuota
        WHERE c.id_socios = $1
        GROUP BY
            c.id_cuota,
            c.fecha_emision,
            c.fecha_ult_rec,
            c.vencimiento,
            c.monto
        ORDER BY
            c.fecha_emision DESC,
            c.id_cuota DESC;`

    const consultaPagos = `
        SELECT
            p.id_pago,
            p.fecha_pago,
            p.monto_total,
            p.metodo_pago,
            COALESCE(
                SUM(dp.monto_aplicado),
                0
            ) AS monto_aplicado
        FROM pagos p
        LEFT JOIN detalle_pago dp
            ON dp.id_pago = p.id_pago
        WHERE p.id_socios = $1
        GROUP BY
            p.id_pago,
            p.fecha_pago,
            p.monto_total,
            p.metodo_pago
        ORDER BY
            p.fecha_pago DESC,
            p.id_pago DESC;
    `
    const resultadoSocio = await pool.query(consultaSocio, [id])
    if (resultadoSocio.rows.length === 0){
        return res.status(404).json({mensaje: "No existe este plan."})
    };

    const resultadoCuotas = await pool.query(consultaCuotas, [id]);

    const resultadoPagos = await pool.query(consultaPagos, [id]);

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

export const agregarSocio = async(req, res) => {
    const body = req.body;
    console.log(body.dni)
    const existe = await pool.query('SELECT * FROM socios WHERE dni = $1', [body.dni])
    const result = existe.rowCount;
    if (result > 0) {
        return res.status(409).json({
            errores: {mensaje: "Ya existe un socio con este DNI"}
        });
    }

    const {rows} = await pool.query( `INSERT INTO socios 
        (id_plan, dni, nombre, apellido, fecha_nacimiento, telefono, redes, email, fecha_alta, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, CURRENT_DATE), $10)
       RETURNING *`, 
       [body.id_plan|| null, body.dni, body.nombre, body.apellido, body.edad || null,
        body.telefono || null, body.redes || null, body.email || null,  body.fecha_alta || null, body.activo
        ])

    return res.json(rows[0])


};

export const editarSocio = async(req, res) => {
    const id = parseInt(req.params.id, 10);
    const body = req.body;
    if (Number.isNaN(id)) {
        return res.status(400).json({mensaje: "El id debe ser un numero."});
    }

    const existe = await pool.query(`SELECT * FROM socios WHERE id_socios = $1`, [id]);

    if (existe.rows.length === 0) {
        return res.status(404).json({mensaje: "No existe este socio"});
    }

    const dniDuplicado = await pool.query(
      'SELECT id_socios FROM socios WHERE dni = $1 AND id_socios != $2',
      [body.dni, id]
    );

    if (dniDuplicado.rows.length > 0) {
      return res.status(409).json({
        errores: { dni: 'El DNI ya pertenece a otro socio' }
      });
    }

    const {rows} = await pool.query(`UPDATE socios SET 
        id_plan = $1, dni = $2, nombre = $3, apellido = $4, edad =$5, telefono = $6, 
        redes = $7, email=$8, fecha_alta=COALESCE($9, CURRENT_DATE), activo =$10
       WHERE id_socios = $11
       RETURNING *`, 
       [body.id_plan, body.dni, body.nombre, body.apellido, body.edad || null,
        body.telefono || null, body.redes || null, body.email || null,  
        body.fecha_alta || null, body.activo, id
        ])

    return res.json(rows[0])

};

export const eliminarSocio = async(req, res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) {
        return res.status(400).json({mensaje: "El id es invalido, debe ser un número."})
    }

    const {rows} =  await pool.query(`DELETE FROM socios WHERE id_socios = $1`, [id])
    
    if (rows.length === 0) {
        return res.status(404).send("mensaje: No exite este plan")
    }
    return res.json({
        plan: rows[0],
        mensaje: "Plan eliminado correctamente"
    })
};