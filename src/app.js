import express from "express";
import cors from "cors";
import router from "./routes/index.routes.js";
/* import path from 'path';
import { fileURLToPath } from "url"; */

const app = express();/* 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public"))); */
app.use(cors());
app.use(express.json());

app.use(router)

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
});

export default app;
