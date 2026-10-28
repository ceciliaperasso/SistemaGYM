import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new pg.Pool({
   user: "postgres",
   host: "localhost",
   password: "54000360",
   database: "sistema_gym",
   port: 5433
});