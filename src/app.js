// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const createDbConnection = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializa a conexão com o banco
createDbConnection().then((db) => {
  
  // Rotas públicas (ex: login)
  const authRoutes = require('./routes/authRoutes')(db);
  app.use('/api/auth', authRoutes);

  // A partir daqui, as rotas estarão protegidas
  const { authenticate } = require('./middlewares/authMiddleware');
  
  // Rotas protegidas
  const clientesRoutes = require('./routes/clientesRoutes')(db);
  const produtosRoutes = require('./routes/produtosRoutes')(db);
  const vendasRoutes = require('./routes/vendasRoutes')(db);
  const comprovantesRoutes = require('./routes/comprovantesRoutes')(db);

  app.use('/api/clientes', authenticate, clientesRoutes);
  app.use('/api/produtos', authenticate, produtosRoutes);
  app.use('/api/vendas', authenticate, vendasRoutes);
  app.use('/api/comprovantes', authenticate, comprovantesRoutes);

  // Inicia o servidor
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao conectar ao banco:', err);
});
