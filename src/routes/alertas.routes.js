import { Router } from "express";
import { listarAlertas, resgistrarNotificacion } from "../controllers/alertas.controllers.js";

const alertasRouter = Router();

alertasRouter.get("/", listarAlertas);
alertasRouter.patch("/:id/notificar", resgistrarNotificacion);

export default alertasRouter;