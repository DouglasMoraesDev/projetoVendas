// src/routes/produtosRoutes.js
import express from 'express'
import {
  listarProdutos,
  adicionarProduto,
  atualizarProduto,
  deletarProduto
} from '../controllers/produtosController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

export default function(db) {
  const router = express.Router()

  // Aplica autenticação em todas as rotas
  router.use(authenticate)

  // GET /api/produtos
  router.get('/', (req, res) => listarProdutos(db, req, res))

  // POST /api/produtos → cria produto a partir de JSON { nome, preco, qtd, foto }
  router.post('/', (req, res) => adicionarProduto(db, req, res))

  // PUT /api/produtos/:id → atualiza produto a partir de JSON { nome, preco, qtd, foto }
  router.put('/:id', (req, res) => atualizarProduto(db, req, res))

  // DELETE /api/produtos/:id
  router.delete('/:id', (req, res) => deletarProduto(db, req, res))

  return router
}
