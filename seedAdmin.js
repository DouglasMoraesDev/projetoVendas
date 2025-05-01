// seedAdmin.js
import bcrypt from 'bcrypt';
import { createDbConnection } from './src/config/database.js';
import { users } from './src/models/users.js';

async function seedAdmin() {
  try {
    // FORÇAR uso da DATABASE_URL
    if (!process.env.DATABASE_URL) {
      console.error('🚨 DATABASE_URL não encontrada em process.env');
      process.exit(1);
    }

    const db = await createDbConnection();  // agora vai usar o branch DATABASE_URL

    const username = 'admin';
    const plainPassword = 'admin';
    const password = await bcrypt.hash(plainPassword, 10);

    // Remove admin caso exista
    await db.delete(users).where(users.username, '=', username);

    // Insere novo admin
    await db.insert(users).values({ username, password });

    console.log(`✅ Usuário "${username}" criado com senha "${plainPassword}"`);
    process.exit(0);

  } catch (err) {
    console.error('❌ Erro no seedAdmin:', err.stack || err);
    process.exit(1);
  }
}

seedAdmin();
