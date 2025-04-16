// src/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { createDbConnection } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import clientesRoutes from './routes/clientesRoutes.js';
import produtosRoutes from './routes/produtosRoutes.js';
import vendasRoutes from './routes/vendasRoutes.js';
import comprovantesRoutes from './routes/comprovantesRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  try {
    const db = await createDbConnection();

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

    app.use('/api/auth', authRoutes(db));
    app.use('/api/clientes', clientesRoutes(db));
    app.use('/api/produtos', produtosRoutes(db));
    app.use('/api/vendas', vendasRoutes(db));
    app.use('/api/comprovantes', comprovantesRoutes(db));
    app.use('/api/upload', uploadRoutes);

    const port = process.env.PORT ?? 3000;
    app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
  }
}

start();
