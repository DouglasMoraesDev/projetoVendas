import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// onde serão salvos os uploads
const BASE_UPLOADS = path.join(__dirname, '../uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type === 'produto' ? 'produtos' : 'comprovantes'
    const dir = path.join(BASE_UPLOADS, type)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, name)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/.test(file.mimetype)
    && /jpeg|jpg|png/.test(path.extname(file.originalname).toLowerCase())
  cb(allowed ? null : new Error('Formato inválido.'), allowed)
}

export const upload = multer({ storage, fileFilter })
