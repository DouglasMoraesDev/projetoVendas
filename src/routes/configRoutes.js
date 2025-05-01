// src/routes/configRoutes.js
import { Router } from "express";
import { ConfigController } from "../controllers/ConfigController.js";
// Se você fez `export function authMiddleware` no auth.js:
//    ↑ nome exato entre chaves
import { authMiddleware } from "../middlewares/authMiddleware.js";
// Se você fez `export default authMiddleware` no auth.js, use:
// import authMiddleware from "../middlewares/auth.js";

const router = Router();

router.get("/backup", authMiddleware, ConfigController.backup);
router.get("/auditoria", authMiddleware, ConfigController.auditoria);

export default router;
