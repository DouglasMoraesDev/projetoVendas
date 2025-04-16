// comprovantesRoutes.js
import express from 'express';
import {
  listarComprovantes,
  adicionarComprovante
} from '../controllers/comprovantesController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export default function(db) {
  const router = express.Router();
  router.use(authenticate);
  router.get('/:venda_id?', (req, res) => listarComprovantes(db, req, res));
  router.post('/', (req, res) => adicionarComprovante(db, req, res));
  return router;
}