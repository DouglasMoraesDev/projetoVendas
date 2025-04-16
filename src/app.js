// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const createDbConnection = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1) Serve tudo de public/ (páginas, css, js)
app.use(express.static(path.join(__dirname, '../public')));

// 2) Serve somente as imagens que estão em public/uploads
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../public/uploads'))
);

createDbConnection()
  .then((db) => {
    const authRoutes = require('./routes/authRoutes')(db);
    app.use('/api/auth', authRoutes);

    const { authenticate } = require('./middlewares/authMiddleware');
    app.use('/api/clientes',    authenticate, require('./routes/clientesRoutes')(db));
    app.use('/api/produtos',    authenticate, require('./routes/produtosRoutes')(db));
    app.use('/api/vendas',      authenticate, require('./routes/vendasRoutes')(db));
    app.use('/api/comprovantes',authenticate, require('./routes/comprovantesRoutes')(db));

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco:', err);
  });
