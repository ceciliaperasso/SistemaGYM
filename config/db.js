import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new pg.Pool({
   user: "postgres",
   host: "localhost",
   password: "agenteloco123",
   database: "sistema_gym",
   port: 5432
});