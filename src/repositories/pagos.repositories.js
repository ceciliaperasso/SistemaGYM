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

export async function registrarPagoCuota(idCuota) {
    const cliente = await pool.connect();

    try {
        await cliente.query("BEGIN");

        const cuotaResultado = await cliente.query(
            `SELECT id_cuota, id_socios
             FROM cuotas
             WHERE id_cuota = $1
             FOR UPDATE`,
            [idCuota]
        );

        if (cuotaResultado.rows.length === 0) {
            await cliente.query("ROLLBACK");
            return { estado: "no_encontrada" };
        }

        const cuota = cuotaResultado.rows[0];
        const saldoResultado = await cliente.query(
            `SELECT GREATEST(
                c.monto - COALESCE(SUM(dp.monto_aplicado), 0),
                0
             )::numeric(10, 2)::text AS saldo
             FROM cuotas c
             LEFT JOIN detalle_pago dp
                ON dp.id_cuota = c.id_cuota
             WHERE c.id_cuota = $1
             GROUP BY c.id_cuota, c.monto`,
            [idCuota]
        );
        const saldo = saldoResultado.rows[0].saldo;

        if (Number(saldo) <= 0) {
            await cliente.query(
                `UPDATE cuotas SET estado = 'Pagada' WHERE id_cuota = $1`,
                [idCuota]
            );
            await cliente.query("COMMIT");
            return { estado: "ya_pagada" };
        }

        const pagoResultado = await cliente.query(
            `INSERT INTO pagos (id_socios, monto_total, metodo_pago)
             VALUES ($1, $2, 'Efectivo')
             RETURNING id_pago, id_socios, monto_total, fecha_pago, metodo_pago`,
            [cuota.id_socios, saldo]
        );
        const pago = pagoResultado.rows[0];

        await cliente.query(
            `INSERT INTO detalle_pago (id_pago, id_cuota, monto_aplicado)
             VALUES ($1, $2, $3)`,
            [pago.id_pago, idCuota, saldo]
        );
        await cliente.query(
            `UPDATE cuotas SET estado = 'Pagada' WHERE id_cuota = $1`,
            [idCuota]
        );

        await cliente.query("COMMIT");
        return { estado: "registrado", pago };
    } catch (error) {
        await cliente.query("ROLLBACK");
        throw error;
    } finally {
        cliente.release();
    }
}