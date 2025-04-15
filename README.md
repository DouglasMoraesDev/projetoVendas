Sistema de Vendas - Versão 2 (Node.js + Drizzle ORM + MySQL)


projetovendas/
├── src/
│   ├── config/
│   │   └── database.js               # Configura a conexão com o MySQL usando Drizzle
│   │
│   ├── controllers/
│   │   ├── authController.js         # Lida com login (autenticação)
│   │   ├── clientesController.js     # CRUD para clientes
│   │   ├── produtosController.js     # CRUD para mercadorias
│   │   ├── vendasController.js       # Registra vendas e atualiza estoque
│   │   └── comprovantesController.js # Gerencia comprovantes (anexos de venda)
│   │
│   ├── models/
│   │   ├── users.js                  # Schema/table users para o Drizzle
│   │   ├── clientes.js               # Schema/table clientes
│   │   ├── produtos.js               # Schema/table produtos
│   │   ├── vendas.js                 # Schema/table vendas
│   │   └── comprovantes.js           # Schema/table comprovantes
│   │
│   ├── routes/
│   │   ├── authRoutes.js             # Rota para login
│   │   ├── clientesRoutes.js         # Rotas para clientes
│   │   ├── produtosRoutes.js         # Rotas para produtos
│   │   ├── vendasRoutes.js           # Rotas para vendas
│   │   └── comprovantesRoutes.js     # Rotas para comprovantes
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js         # Middleware para proteger endpoints
│   │
│   ├── utils/
│   │   └── helpers.js                # Funções auxiliares (token, hashing etc)
│   │
│   └── app.js                        # Arquivo principal do Express
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── clientes.js
│   │   ├── comprovante.js
│   │   ├── dashbord.js
│   │   ├── historico.js
│   │   ├── index.js
│   │   ├── parcelas.js
│   │   ├── produtos.js
│   │   └── vendas.js
│   │
│   ├── clientes.html
│   ├── comprovante.html
│   ├── dashboard.html
│   ├── historico.html
│   ├── index.html
│   ├── parcelas.html
│   ├── produtos.html
│   └── vendas.html
│
├── .env
├── package.json
└── README.md

# projetoVendas
