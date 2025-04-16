// src/routes/vendasRoutes.js
import express from 'express';
import {
  listarVendas,
  adicionarVenda,
  gerarRecibo,
  atualizarVenda,
  deletarVenda
} from '../controllers/vendasController.js'; // garante que atualizarVenda existe aqui
import { authenticate } from '../middlewares/authMiddleware.js';

export default function(db) {
  const router = express.Router();

  // Aplica autenticação a todas as rotas
  router.use(authenticate);

  // Listar todas as vendas
  router.get('/', (req, res) => listarVendas(db, req, res));

  // Criar nova venda
  router.post('/', (req, res) => adicionarVenda(db, req, res));

  // Gerar recibo de uma venda específica
  router.get('/:id/recibo', (req, res) => gerarRecibo(db, req, res));

  // Atualizar dados de uma venda existente
  router.put('/:id', (req, res) => atualizarVenda(db, req, res));

  // Deletar uma venda
  router.delete('/:id', (req, res) => deletarVenda(db, req, res));

  return router;
}
