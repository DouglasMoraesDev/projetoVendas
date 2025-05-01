// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users } from '../models/users.js';
import { eq } from 'drizzle-orm';

export async function login(db, req, res, next) {
  const { username, password } = req.body;
  try {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Senha incorreta' });

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET não definido');

    const token = jwt.sign(
      { id: user.id, username: user.username },
      secret,
      { expiresIn: '1h' }
    );
    return res.json({ token });
  } catch (err) {
    console.error('AUTH LOGIN ERROR:', err.stack);
    next(err);
  }
}

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Token não fornecido' });

  const [, token] = header.split(' ');
  if (!token) return res.status(401).json({ error: 'Token mal formatado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
}
