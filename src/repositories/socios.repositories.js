
import {pool} from "../../config/db.js";

export const buscarPorTexto = async (texto) => {
    const palabras = texto.trim().split(/\s+/);

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
        LEFT JOIN planes pl
            ON pl.id_plan = s.id_plan
        LEFT JOIN ultima_cuota uc
            ON uc.id_socios = s.id_socios
        WHERE  ${condiciones}
        ORDER BY s.apellido, s.nombre
        LIMIT 20`,
        valores
    );

    return rows;
};


export const listaSocios = `WITH cuotas_saldo AS (
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
        ORDER BY s.apellido, s.nombre;`

export const consultaSocio = `SELECT
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

export const consultaCuotas = `
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


export const consultaPagos = `
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

export async function existeSocio(id) {
    const resultado = await pool.query(
        `SELECT * FROM socios WHERE id_socios = $1`,
        [id]
    );

    return resultado.rows.length > 0;
}

export async function dniDuplicado(dni, id) {
    const resultado = await pool.query(
        'SELECT id_socios FROM socios WHERE dni = $1 AND id_socios != $2',
        [dni, id]
    );

    return resultado.rows.length > 0;
}

export async function actualizarSocio(id, body) {
    const { rows } = await pool.query(`UPDATE socios SET 
        id_plan = $1, dni = $2, nombre = $3, apellido = $4, edad =$5, telefono = $6, 
        redes = $7, email=$8, fecha_alta=COALESCE($9, CURRENT_DATE), activo =$10
       WHERE id_socios = $11
       RETURNING *`,
       [body.id_plan, body.dni, body.nombre, body.apellido, body.edad || null,
        body.telefono || null, body.redes || null, body.email || null,
        body.fecha_alta || null, body.activo, id
       ]
    );

    return rows[0];
}

export async function eliminarSocio(id) {
    const { rows } = await pool.query(
        `DELETE FROM socios WHERE id_socios = $1`,
        [id]
    );

    return rows;
}

function limpiarSocio(body) {
    const texto = valor => String(valor ?? "").trim() || null;

    return {
        id_plan: Number(body.id_plan) || null,
        dni: Number(String(body.dni ?? "").replace(/\D/g, "")) || null, // acepta "32.145.678"
        nombre: texto(body.nombre),
        apellido: texto(body.apellido),
        fecha_nacimiento: texto(body.fecha_nacimiento),
        telefono: texto(body.telefono),
        redes: texto(body.redes),
        email: texto(body.email),
        fecha_alta: texto(body.fecha_alta),
    };
}
export async function insertSocio(bodyLimpio) {
    const body = limpiarSocio(bodyLimpio)
    const resultado = await pool.query( `INSERT INTO socios 
        (id_plan, dni, nombre, apellido, fecha_nacimiento, telefono, redes, email, fecha_alta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, CURRENT_DATE))
       RETURNING *`, 
       [body.id_plan|| null, body.dni, body.nombre, body.apellido, body.fecha_nacimiento || null,
        body.telefono || null, body.redes || null, body.email || null,  body.fecha_alta || null])
    
    return resultado
} 