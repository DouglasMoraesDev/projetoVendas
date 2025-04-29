// src/config/database.js
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

export async function createDbConnection() {
  let connConfig;

  if (process.env.DATABASE_URL) {
    // Parsei a URL para extrair host/user/pass/db e habilitar SSL.
    const url = new URL(process.env.DATABASE_URL);
    connConfig = {
      host: url.hostname,
      port: Number(url.port),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: {
        // Railway exige SSL no proxy MySQL
        rejectUnauthorized: false
      }
    };
  } else {
    connConfig = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    };
  }

  const connection = await mysql.createConnection(connConfig);
  return drizzle(connection);
}
