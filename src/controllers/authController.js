// src/controllers/authController.js
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { users } from '../models/users.js'
import { eq } from 'drizzle-orm'

export async function login(db, req, res) {
  const { username, password } = req.body
  console.log('→ LOGIN REQUEST BODY:', { username, password: password ? '****' : undefined })

  try {
    // 1) Verifica se a SECRET chegou
    const secret = process.env.JWT_SECRET
    console.log('→ JWT_SECRET (length):', secret?.length)
    if (!secret) {
      console.error('⚠️ JWT_SECRET vazia ou indefinida')
      return res
        .status(500)
        .json({ error: 'Erro de configuração no servidor' })
    }

    // 2) Busca usuário no banco
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
    console.log('→ DB returned user:', user && { id: user.id, username: user.username })

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' })
    }

    // 3) Compara senha
    let match
    try {
      match = await bcrypt.compare(password, user.password)
    } catch (bcryptErr) {
      console.error('‼️ Erro no bcrypt.compare:', bcryptErr)
      return res.status(500).json({ error: 'Erro ao validar senha' })
    }
    console.log('→ Senha bateu?', match)

    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' })
    }

    // 4) Gera token
    let token
    try {
      token = jwt.sign(
        { id: user.id, username: user.username },
        secret,
        { expiresIn: '1h' }
      )
    } catch (jwtErr) {
      console.error('‼️ Erro no jwt.sign:', jwtErr)
      return res.status(500).json({ error: 'Erro ao gerar token' })
    }

    console.log('→ Token gerado com sucesso')
    return res.json({ token })

  } catch (err) {
    console.error('AUTH LOGIN ERROR:', err.stack)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
