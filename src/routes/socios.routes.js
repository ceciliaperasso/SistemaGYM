import { Router } from "express";
import {listarSocios, agregarSocio, editarSocio, buscarSocios, buscarSociosPorTexto} from "../controllers/socios.controllers.js"

const sociosRouter = Router();

sociosRouter.get("/", listarSocios);

sociosRouter.get('/buscar', buscarSociosPorTexto)

sociosRouter.get('/:id', buscarSocios)

sociosRouter.post("/", agregarSocio);

sociosRouter.put("/:id", editarSocio);

export default sociosRouter;