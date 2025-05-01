import express from 'express'
import { upload } from '../middlewares/upload.js'

const router = express.Router()

// POST /api/upload?type=produto ou /api/upload?type=comprovante
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'Nenhum arquivo enviado'
    })
  }
  const type = req.query.type === 'produto' ? 'produtos' : 'comprovantes'
  res.json({
    success: true,
    filename: req.file.filename,
    url: `/uploads/${type}/${req.file.filename}`
  })
})

export default router
