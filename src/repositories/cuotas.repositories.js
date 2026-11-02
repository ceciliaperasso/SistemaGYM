import { pool } from "../../config/db.js";

export async function insertCuota(idSocio) {
    const resultado = await pool.query(
        `INSERT INTO cuotas (id_socios, vencimiento, monto, periodo)
         SELECT
            s.id_socios,
            (CURRENT_DATE + INTERVAL '1 month')::date,
            pl.precio,
            TO_CHAR((CURRENT_DATE + INTERVAL '1 month')::date, 'YYYY-MM')
         FROM socios s
         JOIN planes pl
            ON pl.id_plan = s.id_plan
         WHERE s.id_socios = $1
         RETURNING *`,
        [idSocio]
    );

    return resultado;
}
