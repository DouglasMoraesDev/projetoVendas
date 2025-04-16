// produtosRoutes.js
import express from 'express';
import {
  listarProdutos,
  adicionarProduto,
  atualizarProduto,
  deletarProduto
} from '../controllers/produtosController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';

export default function(db) {
  const router = express.Router();
  router.use(authenticate);
  router.get('/', (req, res) => listarProdutos(db, req, res));
  router.post('/', upload.single('image'), (req, res) => adicionarProduto(db, req, res));
  router.put('/:id', upload.single('image'), (req, res) => atualizarProduto(db, req, res));
  router.delete('/:id', (req, res) => deletarProduto(db, req, res));
  return router;
}