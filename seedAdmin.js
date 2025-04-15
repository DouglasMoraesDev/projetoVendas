// seedAdmin.js (na raiz do projeto)

require('dotenv').config();
const createDbConnection = require('./src/config/database');
const { hashPassword } = require('./src/utils/helpers');
const { users } = require('./src/models/users');
const { eq } = require('drizzle-orm');

async function seedAdmin() {
  try {
    const db = await createDbConnection();
    const username = 'admin';
    const passwordHash = await hashPassword('admin');

    // Verifica se já existe
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (existing) {
      console.log('Usuário admin já existe com id', existing.id);
      process.exit(0);
    }

    // Insere o admin
    await db
      .insert(users)
      .values({ username, password: passwordHash });

    // Busca o id do admin recém‑criado
    const [admin] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username));

    console.log(`Usuário admin criado com id ${admin.id}`);
    process.exit(0);

  } catch (err) {
    console.error('Erro ao criar usuário admin:', err);
    process.exit(1);
  }
}

seedAdmin();
