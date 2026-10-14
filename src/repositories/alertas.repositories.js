import { pool } from "../../config/db.js";

export async function selectAlertas() {
    const resultado = await pool.query(`
        SELECT
            c.id_cuota,
            s.id_socios,
            s.nombre,
            s.apellido,
            s.dni,
            c.vencimiento,
            c.monto,
            CASE
                WHEN c.vencimiento < CURRENT_DATE
                    THEN 'Vencida'
                ELSE 'Próxima a vencer'
            END AS estado
        FROM cuotas c
        INNER JOIN socios s
            ON s.id_socios = c.id_socios
        WHERE
            s.activo = TRUE
            AND NOT EXISTS (
                SELECT 1
                FROM detalle_pago dp
                WHERE dp.id_cuota = c.id_cuota
            )
            AND (
                c.vencimiento < CURRENT_DATE
                OR c.vencimiento BETWEEN
                    CURRENT_DATE AND CURRENT_DATE + 7
            )
        ORDER BY c.vencimiento ASC
    `);

    return resultado;
};

export async function  updateNotificacion(id) {
    const resultado = await pool.query(
        `UPDATE cuotas
         SET fecha_ult_rec = CURRENT_DATE
         WHERE id_cuota = $1
           AND NOT EXISTS (
               SELECT 1
               FROM detalle_pago dp
               WHERE dp.id_cuota = cuotas.id_cuota
           )
         RETURNING id_cuota, fecha_ult_rec`,
        [id]
    );

    return resultado;
};