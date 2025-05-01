// src/routes/authRoutes.js
import express from 'express';
import { login } from '../controllers/authController.js';

export default function(db) {
  const router = express.Router();
  router.post('/login', (req, res, next) => login(db, req, res, next));
  return router;
}
