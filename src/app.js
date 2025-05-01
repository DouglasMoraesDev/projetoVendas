import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import { createDbConnection } from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import clientesRoutes from './routes/clientesRoutes.js'
import produtosRoutes from './routes/produtosRoutes.js'
import vendasRoutes from './routes/vendasRoutes.js'
import comprovantesRoutes from './routes/comprovantesRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function start() {
  try {
    await createDbConnection()
    const app = express()

    // === Servir estáticos ===
    const publicPath = path.join(__dirname, '../public')
    app.use(express.static(publicPath))

    // Servir uploads (produtos e comprovantes)
    const uploadsPath = path.join(__dirname, '../uploads')
    app.use('/uploads', express.static(uploadsPath))

    // === CORS ===
    const allowedOrigins = [
      'http://localhost:3000',
      'https://projetovendas-production-dc3f.up.railway.app'
    ]
    app.use(cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true)
        }
        callback(new Error(`CORS bloqueado para origem: ${origin}`))
      },
      methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
      credentials: true
    }))
    app.options('*', cors())

    // === Body parsers ===
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ extended: true }))

    // === Rotas Web ===
    app.get('/', (req, res) =>
      res.sendFile(path.join(publicPath, 'login.html'))
    )

    // === Rotas API ===
    app.use('/api/auth', authRoutes())
    app.use('/api/clientes', clientesRoutes())
    app.use('/api/produtos', produtosRoutes())
    app.use('/api/vendas', vendasRoutes())
    app.use('/api/comprovantes', comprovantesRoutes())
    app.use('/api/upload', uploadRoutes)
    app.use('/api/dashboard', dashboardRoutes())

    // === Tratamento de erros global ===
    app.use((err, req, res, next) => {
      console.error('GLOBAL ERROR:', err.stack)
      res.status(500).json({ error: 'Erro interno do servidor' })
    })

    const port = process.env.PORT || 3000
    app.listen(port, () =>
      console.log(`Servidor rodando na porta ${port}`)
    )
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err.stack)
    process.exit(1)
  }
}

start()
