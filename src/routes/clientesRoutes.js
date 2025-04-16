// clientesRoutes.js
import express from 'express';
import {
  listarClientes,
  adicionarCliente,
  atualizarCliente,
  deletarCliente
} from '../controllers/clientesController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export default function(db) {
  const router = express.Router();
  router.use(authenticate);
  router.get('/', (req, res) => listarClientes(db, req, res));
  router.post('/', (req, res) => adicionarCliente(db, req, res));
  router.put('/:id', (req, res) => atualizarCliente(db, req, res));
  router.delete('/:id', (req, res) => deletarCliente(db, req, res));
  return router;
}
