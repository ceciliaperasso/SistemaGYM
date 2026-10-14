import { Router } from "express";
import { agregarPlan, editarPlan, eliminarPlan, listarPlanes, verPlan } from "../controllers/planes.controllers.js";

const planesRouter = Router();

planesRouter.get("/", listarPlanes);

planesRouter.get("/:id", verPlan);

planesRouter.post("/", agregarPlan);

planesRouter.put("/:id", editarPlan);

planesRouter.delete("/:id", eliminarPlan);

export default planesRouter;


