// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users } from '../models/users.js';
import { eq } from 'drizzle-orm';

export async function login(db, req, res) {
  const { username, password } = req.body;
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Senha incorreta' });

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
}
