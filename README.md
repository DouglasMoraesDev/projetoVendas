projetoVendas

Sistema de Vendas - Versão 2

Tecnologias: Node.js, Express, Drizzle ORM, MySQL, Multer, JWT, bcrypt, date-fns, CORS

Descrição

Aplicação backend e frontend leve para gerenciar vendas de produtos, incluindo cadastro de clientes, produtos (com upload de fotos), registro de vendas com controle de estoque, geração de recibos e envio/listagem de comprovantes de pagamento. Possui autenticação JWT para proteger endpoints da API.

Funcionalidades

Autenticação de usuário (login via API)

CRUD de clientes

CRUD de produtos com upload de imagem

Registro de vendas com atualização automática de estoque

Geração de recibo de venda (JSON)

Controle de parcelas e anexação de comprovantes

Listagem de comprovantes por venda

Frontend estático com páginas HTML/CSS/JS em public/

Pré-requisitos

Node.js v14 ou superior

MySQL rodando (local ou remoto)

Gerenciador de pacotes npm ou yarn

Instalação

Clone o repositório:

git clone https://github.com/DouglasMoraesDev/projetoVendas.git
cd projetoVendas

Instale as dependências:

npm install

Configure as variáveis de ambiente criando um arquivo .env na raiz com as seguintes chaves:

PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=nome_do_banco
JWT_SECRET=chave_secreta_para_jwt

Crie o banco de dados no MySQL e execute as migrations ou use o script seedAdmin.js para popular uma conta de usuário inicial. Por exemplo:

node seedAdmin.js

Estrutura de pastas

projetoVendas/
├─ src/
│  ├─ config/
│  │  └─ database.js        # Conexão Drizzle + MySQL
│  ├─ controllers/         # Lógica dos endpoints
│  ├─ models/              # Schemas Drizzle ORM
│  ├─ routes/              # Definição de rotas Express
│  ├─ middlewares/         # Autenticação JWT, upload de imagens
│  ├─ utils/               # Helpers (tokens, hashing, etc.)
│  └─ app.js               # Inicialização do servidor
├─ public/                 # Frontend estático (HTML/CSS/JS)
│  └─ uploads/             # Imagens de produtos e comprovantes
├─ seedAdmin.js            # Script para criar usuário admin
├─ package.json            # Dependências e scripts
└─ .env                    # Variáveis de ambiente (não versionado)

Como rodar

npm start

O servidor iniciará em http://localhost:3000.

Endpoints principais da API

Método

Rota

Descrição

POST

/api/auth/login

Login e obtenção de token JWT

GET

/api/clientes

Lista todos os clientes (autenticado)

POST

/api/clientes

Adiciona cliente (autenticado)

PUT

/api/clientes/:id

Atualiza cliente (autenticado)

DELETE

/api/clientes/:id

Remove cliente (autenticado)

GET

/api/produtos

Lista produtos (autenticado)

POST

/api/produtos

Adiciona produto com foto (autenticado)

PUT

/api/produtos/:id

Atualiza produto/foto (autenticado)

DELETE

/api/produtos/:id

Remove produto (autenticado)

GET

/api/vendas

Lista vendas (autenticado)

POST

/api/vendas

Registra nova venda (autenticado)

GET

/api/vendas/:id/recibo

Gera recibo de venda (autenticado)

PUT

/api/vendas/:id

Atualiza uma venda (autenticado)

DELETE

/api/vendas/:id

Remove venda (autenticado)

GET

/api/comprovantes/:venda_id?

Lista comprovantes (autenticado)

POST

/api/comprovantes

Anexa comprovante e atualiza parcelas

Observações

As rotas de clientes, produtos, vendas e comprovantes exigem o header Authorization: Bearer <token>.

As páginas front-end em public/ consomem a API via fetch e usam o token armazenado no localStorage.

Licença

Este projeto está sob a [MIT License].


