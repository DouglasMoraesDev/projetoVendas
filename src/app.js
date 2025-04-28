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
import dashboardRoutes from './routes/dashboardRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  try {
    // abre conexão com o banco
    const db = await createDbConnection();

    const app = express();

    // === CORS ===
    // Whitelist: só as URLs que vão consumir sua API
    const allowedOrigins = [
      'https://projetovendas-production-b93b.up.railway.app',
      'http://localhost:3000'
    ];

    app.use(cors({
      origin(origin, callback) {
        // Se não vier origin (ex: Postman), deixa passar
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error('Bloqueado por CORS'));
      },
      methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
      credentials: true
    }));
    // permite preflight para todas as rotas
    app.options('*', cors());

    // === body parsers ===
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // === rotas web ===
    app.get('/', (req, res) =>
      res.sendFile(path.join(__dirname, '../public/login.html'))
    );
    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

    // === rotas API ===
    app.use('/api/auth', authRoutes(db));
    app.use('/api/clientes', clientesRoutes(db));
    app.use('/api/produtos', produtosRoutes(db));
    app.use('/api/vendas', vendasRoutes(db));
    app.use('/api/comprovantes', comprovantesRoutes(db));
    app.use('/api/upload', uploadRoutes);
    app.use('/api/dashboard', dashboardRoutes(db));

    const port = process.env.PORT ?? 3000;
    app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
  }
}

start();
