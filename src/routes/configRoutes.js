import { Router } from "express";
import { ConfigController } from "../controllers/ConfigController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// só usuários autenticados podem fazer backup ou auditoria
router.get("/backup", authMiddleware, ConfigController.backup);
router.get("/auditoria", authMiddleware, ConfigController.auditoria);

export default router;
