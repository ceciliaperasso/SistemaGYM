import { Router } from "express";
import * as controller from "../controllers/cuotas.controllers.js";

const cuotasRouter = Router();

cuotasRouter.post("/", controller.crearCuota);

export default cuotasRouter;
