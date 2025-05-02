// src/routes/configRoutes.js
import { Router } from "express";
import { ConfigController } from "../controllers/ConfigController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

// Rota para gerar backup em JSON
router.get("/backup", authenticate, ConfigController.backup);

// Rota para relatório de auditoria mensal
router.get("/auditoria", authenticate, ConfigController.auditoria);

// Rota para relatório de auditoria em PDF
router.get("/auditoria/pdf", authenticate, ConfigController.auditoriaPdf);


// Default export do router
export default router;
