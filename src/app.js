import express from "express";
import cors from "cors";
import router from "./routes/index.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(router)

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
});

export default app;
