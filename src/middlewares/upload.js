import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = path.join(__dirname, '../uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type === 'produto' ? 'produtos' : 'comprovantes'
    const dir = path.join(BASE, type)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${Date.now()}${ext}`)
  }
})

export const upload = multer({ storage })
