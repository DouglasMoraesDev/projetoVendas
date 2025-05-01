// src/config/database.js
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

async function initDb() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    const conn = await mysql.createConnection({
      host: url.hostname,
      port: Number(url.port),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: { rejectUnauthorized: false },
    });
    return drizzle(conn);
  }

  // fallback local
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  return drizzle(conn);
}

// top-level await (Node.js >= 14+ com "type":"module")
export const db = await initDb();
