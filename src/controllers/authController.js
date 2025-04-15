// src/controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { users } = require('../models/users');
const { eq } = require('drizzle-orm');

const login = async (db, req, res) => {
  const { username, password } = req.body;
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro de servidor' });
  }
};

module.exports = { login };
