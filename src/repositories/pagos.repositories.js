import { pool } from "../../config/db.js";

export async function selectPagos() {
    const resultado = await pool.query(
        `SELECT
            s.nombre,
            s.apellido,
            pl.dias AS plan,
            p.monto_total AS monto,
            p.fecha_pago AS fecha,
            p.metodo_pago AS metodo
        FROM pagos p
        JOIN socios s  ON s.id_socios = p.id_socios
        JOIN planes pl ON pl.id_plan  = s.id_plan
        ORDER BY p.fecha_pago DESC;`
    );

    return resultado;
}

export async function sumarPagos() {
    const resultado = await pool.query(
        `SELECT COALESCE(SUM(monto_total), 0) AS total_mes
        FROM pagos
        /* WHERE fecha_pago >= date_trunc('month', CURRENT_DATE)
        AND fecha_pago <  date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' */`
    );

    return resultado;
}

export async function totalPagos() {
    const resultado = await pool.query(
        `SELECT COUNT(*) AS total_pagos
        FROM pagos;`
    )

    return resultado;
}