// src/config/database.js

import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

export async function createDbConnection() {
  // Se o Railway fornecer DATABASE_URL, usa ela.
  const connection = process.env.DATABASE_URL
    ? await mysql.createConnection(process.env.DATABASE_URL)
    : await mysql.createConnection({
        host:     process.env.DB_HOST,
        port:     Number(process.env.DB_PORT),
        user:     process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });

  return drizzle(connection);
}
