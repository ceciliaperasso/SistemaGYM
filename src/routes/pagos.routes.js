import { Router } from "express";
import * as controller from "../controllers/pagos.controllers.js";

const pagosRouter = Router();

pagosRouter.get("/", controller.listarPagos);
pagosRouter.get("/suma", controller.sumarPagos);

export default pagosRouter;
