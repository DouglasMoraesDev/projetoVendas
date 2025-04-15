// src/routes/comprovantesRoutes.js
const express = require('express');
const router = express.Router();
const comprovantesController = require('../controllers/comprovantesController');

module.exports = (db) => {
  router.get('/:venda_id?', (req, res) => comprovantesController.listarComprovantes(db, req, res));
  router.post('/', (req, res) => comprovantesController.adicionarComprovante(db, req, res));
  return router;
};
