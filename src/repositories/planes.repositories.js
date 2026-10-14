import { pool } from "../../config/db.js";

export async function selectPlanes() {
    const resultado = await pool.query(
        `SELECT * FROM planes`
    );

    return resultado;
};

export async function selectPlan(id) {
    const resultado = await pool.query(
        `SELECT * FROM planes WHERE id_plan = $1`, [id]
    );

    return resultado;
};

export async function insertPlan(body) {
    const resultado = await pool.query(
        `INSERT INTO planes (
            dias, precio) 
        VALUES(
            $1, $2) 
        RETURNING *`, [body.dias, body.precio]
    )
    
    return resultado;
};

export async function updatePlan(body) {
    const resultado = await pool.query(
        `UPDATE planes SET
            dias = $1, precio = $2
        WHERE
            id_plan = $3
        RETURNING *`, 
        [body.dias, body.precio, body.id_plan]
    )

    return resultado;
};

export async function deletePlan(id) {
    const resultado = await pool.query(
        `DELETE FROM planes WHERE id_plan = $1 RETURNING *`,
        [id]
    )

    return resultado;
};