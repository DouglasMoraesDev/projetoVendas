// Configuração do Multer para uploads de imagens
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const uploadDir = path.join('public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, name);
  }
});

const fileFilter = (_, file, cb) => {
  const ok = /jpeg|jpg|png/.test(file.mimetype)
    && /jpeg|jpg|png/.test(path.extname(file.originalname).toLowerCase());
  cb(ok ? null : new Error('Formato inválido.'), ok);
};

export const upload = multer({ storage, fileFilter });
