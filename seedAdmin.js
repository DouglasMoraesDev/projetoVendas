// seedAdmin.js

import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

async function seedAdmin() {
  // Conexão direta com MySQL (mesmo config do createDbConnection)
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT),
    user:     process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  // Verifica se já existe o admin
  const [rows] = await conn.execute(
    'SELECT 1 FROM usuarios WHERE email = ? LIMIT 1',
    ['admin@exemplo.com']
  );

  if (rows.length === 0) {
    const hash = await bcrypt.hash('suaSenhaAdmin', 10);
    await conn.execute(
      `INSERT INTO usuarios (nome, email, senha_hash, perfil)
       VALUES (?, ?, ?, ?)`,
      ['Admin', 'admin@exemplo.com', hash, 'admin']
    );
    console.log('Admin seed criado.');
  } else {
    console.log('Admin já existe.');
  }

  await conn.end();
  process.exit(0);
}

seedAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
