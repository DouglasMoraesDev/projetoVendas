// authRoutes.js
import express from 'express';
import { login } from '../controllers/authController.js';

export default function(db) {
  const router = express.Router();
  router.post('/login', (req, res) => login(db, req, res));
  return router;
}