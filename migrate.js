// migrate.js
import 'dotenv/config';
import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';

async function migrate() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT),
    user:     process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  // Lê o schema.sql completo
  const sql = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');

  // Separa por “;” e executa cada bloco
  const stmts = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of stmts) {
    await conn.execute(stmt);
    console.log('Migrated:', stmt.split('\n')[0]);
  }

  await conn.end();
  console.log('Migrações finalizadas.');
}

migrate().catch(err => {
  console.error('Erro na migração:', err);
  process.exit(1);
});
