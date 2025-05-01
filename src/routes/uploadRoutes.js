// src/routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const router = express.Router();

// define storage dinamicamente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // aqui você decide pela query ?type=produto ou ?type=comprovante
    const type = req.query.type === 'produto' ? 'produtos' : 'comprovantes';
    const fullPath = path.join(__dirname, '../public/uploads', type);
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || '';
    cb(null, `${timestamp}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  // devolve o URL completo que o front-end vai usar
  const type = req.query.type === 'produto' ? 'produtos' : 'comprovantes';
  const filename = req.file.filename;
  res.json({
    success: true,
    filename,
    url: `/uploads/${type}/${filename}`
  });
});

export default router;
