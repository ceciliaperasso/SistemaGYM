import { Router } from "express";

import sociosRouter from "./socios.routes.js"
import planesRouter from "./planes.routes.js"
import alertasRouter from "./alertas.routes.js";
import pagosRouter from "./pagos.routes.js";

const router = Router();

router.use("/socios", sociosRouter);
router.use("/planes", planesRouter);
router.use("/alertas", alertasRouter);
router.use("/pagos", pagosRouter);

export default router;