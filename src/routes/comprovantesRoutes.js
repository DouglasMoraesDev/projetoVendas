// src/routes/comprovantesRoutes.js

import express from 'express';
import {
  listarComprovantes,
  adicionarComprovante
} from '../controllers/comprovantesController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js'; // import do Multer

export default function(db) {
  const router = express.Router();

  // Protege todas as rotas com autenticação
  router.use(authenticate);

  // Listar comprovantes (todos ou por venda_id)
  router.get('/', (req, res) =>
    listarComprovantes(db, req, res)
  );
  router.get('/:venda_id', (req, res) =>
    listarComprovantes(db, req, res)
  );

  // Adicionar um novo comprovante com upload de arquivo
  router.post(
    '/',
    upload.single('comprovante'),       // <-- certifique-se que o name do seu <input> é "comprovante"
    (req, res) => {
      // Multer coloca dados do arquivo em req.file
      // Se seu controller espera o nome do arquivo em req.body:
      if (req.file) {
        req.body.filename = req.file.filename;
      }
      return adicionarComprovante(db, req, res);
    }
  );

  return router;
}
