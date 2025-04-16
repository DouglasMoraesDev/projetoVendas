// src/middlewares/upload.js

const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Diretório de uploads dentro de public
const uploadDir = path.join(__dirname, '../../public/uploads');
// Garante que o diretório exista
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimeOK = allowedTypes.test(file.mimetype);
  const extOK = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (mimeOK && extOK) {
    cb(null, true);
  } else {
    cb(new Error('Formato inválido. Use JPEG, JPG ou PNG.'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
