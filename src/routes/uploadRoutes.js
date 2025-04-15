// src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

// Rota para upload de um único arquivo (campo "image")
router.post('/', upload.single('image'), (req, res) => {
  try {
    // req.file possui as informações do arquivo enviado.
    return res.status(200).json({ 
      message: 'Upload realizado com sucesso!', 
      imageUrl: req.file.path 
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
