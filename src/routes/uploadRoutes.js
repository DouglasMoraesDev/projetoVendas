// src/routes/uploadRoutes.js
import express from 'express';
import { upload } from '../middlewares/upload.js';

const router = express.Router();
router.post('/', upload.single('image'), (req, res) => {
  res.status(200).json({ message: 'Upload realizado!', imageUrl: req.file.path });
});

export default router;
