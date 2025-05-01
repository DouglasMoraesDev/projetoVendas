import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { users } from '../models/users.js'
import { eq } from 'drizzle-orm'

export async function login(db, req, res) {
  const { username, password } = req.body

  try {
    // 1) Verifica se a SECRET chegou
    const secret = process.env.JWT_SECRET
    if (!secret) {
      console.error('⚠️ JWT_SECRET vazia ou indefinida:', secret)
      return res
        .status(500)
        .json({ error: 'Erro de configuração no servidor' })
    }

    // 2) Busca usuário no banco
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' })
    }

    // 3) Compara senha
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' })
    }

    // 4) Gera token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      secret,
      { expiresIn: '1h' }
    )

    return res.json({ token })

  } catch (err) {
    // imprime stack para você ver no log do Railway
    console.error('AUTH LOGIN ERROR:', err.stack)
    // devolve mensagem genérica pro front
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  const [, token] = header.split(' ')
  if (!token) {
    return res.status(401).json({ error: 'Token mal formatado' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' })
    }
    req.user = decoded
    next()
  })
}
