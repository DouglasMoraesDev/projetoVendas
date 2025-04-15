// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });
  
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token mal formatado' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
};

module.exports = { authenticate };
