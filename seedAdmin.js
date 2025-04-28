// seedAdmin.js (no root do projeto)
import 'dotenv/config';
import { createDbConnection } from './src/config/database.js';

async function seedAdmin() {
  const db = await createDbConnection();

  // Exemplo: insere um usuário admin se não existir
  const [exists] = await db.execute(
    `SELECT 1 FROM usuarios WHERE email = ? LIMIT 1`,
    ['admin@exemplo.com']
  );
  if (!exists.length) {
    await db.execute(
      `INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)`,
      ['Admin', 'admin@exemplo.com', /* bcrypt da senha */, 'admin']
    );
    console.log('Admin seed criado.');
  } else {
    console.log('Admin já existe.');
  }

  process.exit(0);
}

seedAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
