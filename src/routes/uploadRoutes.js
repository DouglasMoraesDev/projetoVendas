// src/routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ?type=produto ou ?type=comprovante
    const type = req.query.type === 'produto' ? 'produtos' : 'comprovantes';
    cb(null, path.join(__dirname, '../public/uploads', type));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  }
});

const upload = multer({ storage });
const router = express.Router();

// POST /api/upload?type=produto ou ?type=comprovante
router.post('/', upload.single('file'), (req, res) => {
  const type = req.query.type === 'produto' ? 'produtos' : 'comprovantes';
  res.json({
    success: true,
    filename: req.file.filename,
    url: `/uploads/${type}/${req.file.filename}`
  });
});

export default router;
