// src/middleware/upload.js
const multer = require('multer');
const path = require('path');

// Define o destino e o nome do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define a pasta "uploads" na raiz do projeto
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    // Gera um nome único para o arquivo e preserva sua extensão
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Filtra somente imagens (jpeg, jpg, png)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimeOK = allowedTypes.test(file.mimetype);
  const extOK = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (mimeOK && extOK) {
    return cb(null, true);
  }
  cb(new Error('Formato de arquivo inválido. Apenas JPEG, JPG e PNG são permitidos.'));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
