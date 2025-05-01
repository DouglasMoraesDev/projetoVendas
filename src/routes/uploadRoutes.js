import express from 'express'
import { upload } from '../middlewares/upload.js'

const router = express.Router()

// POST /api/upload?type=produto ou ?type=comprovante
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'Nenhum arquivo enviado'
    })
  }

    // DEBUG: mostra o path absoluto onde o arquivo foi salvo
    console.log('>> Upload salvo em:', req.file.path);

  // ← LOG para debug:
  console.log('>> Upload gravado em:', req.file.path)

  const type = req.query.type === 'produto' ? 'produtos' : 'comprovantes'
  res.json({
    success: true,
    filename: req.file.filename,
    url: `/uploads/${type}/${req.file.filename}`
  })
})

export default router
