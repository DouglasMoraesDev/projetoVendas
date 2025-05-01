// src/routes/configRoutes.js
import { Router } from "express";
import { ConfigController } from "../controllers/ConfigController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/backup", authenticate, ConfigController.backup);
router.get("/auditoria", authenticate, ConfigController.auditoria);

export default router;
