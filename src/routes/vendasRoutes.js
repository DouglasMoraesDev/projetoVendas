// src/routes/vendasRoutes.js

const express = require('express');
const router = express.Router();
const vendasController = require('../controllers/vendasController');

module.exports = (db) => {
  router.get('/', (req, res) => vendasController.listarVendas(db, req, res));
  router.post('/', (req, res) => vendasController.adicionarVenda(db, req, res));
  router.put('/:id', (req, res) => vendasController.atualizarVenda(db, req, res));
  router.delete('/:id', (req, res) => vendasController.deletarVenda(db, req, res));
  return router;
};
