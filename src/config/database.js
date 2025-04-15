// src/config/database.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const { drizzle } = require('drizzle-orm/mysql2');

async function createDbConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  return drizzle(connection);
}

// Exporta uma promessa (você pode criar uma função helper para aguardar a conexão)
module.exports = createDbConnection;
