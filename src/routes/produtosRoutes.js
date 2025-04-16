const express = require('express');
const produtosController = require('../controllers/produtosController');
const upload = require('../middlewares/upload');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => produtosController.listarProdutos(db, req, res));
  router.post('/', upload.single('image'), (req, res) => produtosController.adicionarProduto(db, req, res));
  router.put('/:id', upload.single('image'), (req, res) => produtosController.atualizarProduto(db, req, res));
  router.delete('/:id', (req, res) => produtosController.deletarProduto(db, req, res));

  return router;
};
