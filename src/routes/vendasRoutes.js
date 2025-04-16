// src/routes/vendasRoutes.js
import express from 'express';
import {
  listarVendas,
  adicionarVenda,
  gerarRecibo,
  atualizarVenda,
  deletarVenda
} from '../controllers/vendasController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export default function(db) {
  const router = express.Router();
  router.use(authenticate);
  router.get('/', (req, res) => listarVendas(db, req, res));
  router.post('/', (req, res) => adicionarVenda(db, req, res));
  router.get('/:id/recibo', (req, res) => gerarRecibo(db, req, res));
  router.put('/:id', (req, res) => atualizarVenda(db, req, res));
  router.delete('/:id', (req, res) => deletarVenda(db, req, res));
  return router;
}
