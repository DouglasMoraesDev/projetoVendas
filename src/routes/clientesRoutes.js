// src/routes/clientesRoutes.js
const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

module.exports = (db) => {
  router.get('/', (req, res) => clientesController.listarClientes(db, req, res));
  router.post('/', (req, res) => clientesController.adicionarCliente(db, req, res));
  router.put('/:id', (req, res) => clientesController.atualizarCliente(db, req, res));
  router.delete('/:id', (req, res) => clientesController.deletarCliente(db, req, res));
  return router;
};
