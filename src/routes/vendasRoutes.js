// src/routes/vendasRoutes.js
import express from 'express';
import {
  listarVendas,
  adicionarVenda,
  obterVenda,
  gerarRecibo,
  gerarReciboPdf,
  atualizarVenda,
  deletarVenda
} from '../controllers/vendasController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export default function(db) {
  const router = express.Router();
  router.use(authenticate);

  // 1) Lista todas as vendas
  router.get('/', (req, res) => listarVendas(db, req, res));

  // 2) Gera PDF de recibo
  router.get('/:id/recibo-pdf', (req, res) => gerarReciboPdf(db, req, res));

  // 3) Retorna recibo em JSON
  router.get('/:id/recibo', (req, res) => gerarRecibo(db, req, res));

  // 4) Busca venda por id
  router.get('/:id', (req, res) => obterVenda(db, req, res));

  // 5) Cria nova venda
  router.post('/', (req, res) => adicionarVenda(db, req, res));

  // 6) Atualiza venda existente
  router.put('/:id', (req, res) => atualizarVenda(db, req, res));

  // 7) Deleta uma venda
  router.delete('/:id', (req, res) => deletarVenda(db, req, res));

  return router;
}
