// src/routes/produtosRoutes.js
const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtosController');

module.exports = (db) => {
  router.get('/', (req, res) => produtosController.listarProdutos(db, req, res));
  router.post('/', (req, res) => produtosController.adicionarProduto(db, req, res));
  router.put('/:id', (req, res) => produtosController.atualizarProduto(db, req, res));
  router.delete('/:id', (req, res) => produtosController.deletarProduto(db, req, res));
  return router;
};
