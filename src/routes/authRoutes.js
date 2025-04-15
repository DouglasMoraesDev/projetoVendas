// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

module.exports = (db) => {
  router.post('/login', (req, res) => authController.login(db, req, res));
  return router;
};
