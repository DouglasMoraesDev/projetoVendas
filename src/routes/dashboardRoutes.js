// dashboardRoutes.js
import express from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export default function(db) {
  const router = express.Router();
  router.use(authenticate);
  router.get('/', (req, res) => getDashboard(db, req, res));
  return router;
}