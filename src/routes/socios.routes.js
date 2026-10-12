import { Router } from "express";
import {listarSocios, agregarSocio, editarSocio, buscarSocios, buscarSociosPorTexto, eliminarSocio} from "../controllers/socios.controllers.js"

const sociosRouter = Router();

sociosRouter.get("/", listarSocios);

sociosRouter.get('/buscar', buscarSociosPorTexto)

sociosRouter.get('/:id', buscarSocios)

sociosRouter.post("/", agregarSocio);

sociosRouter.put("/:id", editarSocio);

sociosRouter.delete("/:id", eliminarSocio);

export default sociosRouter;