// src/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { createDbConnection } from './config/database.js';
// demais imports de rotas...

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  try {
    const db = await createDbConnection();
    const app = express();

    // === CORS ===
    const allowedOrigins = [
      'https://sistemavendas.up.railway.app',
      'http://localhost:3000'
    ];

    app.use(cors({
      origin(origin, cb) {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`Bloqueado por CORS: ${origin}`));
      },
      methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
      credentials: true
    }));
    app.options('*', cors());

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // front-end estático (HTML/JS/CSS em public/)
    app.get('/', (req, res) =>
      res.sendFile(path.join(__dirname, '../public/login.html'))
    );
    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

    // rotas API (exemplo)
    app.use('/api/auth',    authRoutes(db));
    app.use('/api/clientes', clientesRoutes(db));
    app.use('/api/produtos', produtosRoutes(db));
    app.use('/api/vendas',  vendasRoutes(db));
    app.use('/api/comprovantes', comprovantesRoutes(db));
    app.use('/api/upload',  uploadRoutes);
    app.use('/api/dashboard', dashboardRoutes(db));

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1); // força saída em caso de falha crítica
  }
}

start();
