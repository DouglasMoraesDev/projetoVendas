// src/routes/comprovantesRoutes.js
import express from 'express';
import {
  listarComprovantes,
  adicionarComprovante
} from '../controllers/comprovantesController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export default function(db) {
  const router = express.Router();
  router.use(authenticate);

  // Listar por query string ou por parâmetro de rota
  router.get('/', (req, res) => listarComprovantes(db, req, res));
  router.get('/:venda_id', (req, res) => listarComprovantes(db, req, res));

  router.post('/', (req, res) => adicionarComprovante(db, req, res));
  return router;
}
