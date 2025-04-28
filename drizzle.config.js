// drizzle.config.js

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Pasta onde serão geradas suas migrations
  out: './drizzle',

  // Aponta para o seu arquivo de schema (DDL ou código TS/JS que exporta tabelas)
  schema: './schema.sql',

  // **Essencial**: informe que você está usando MySQL
  dialect: 'mysql',

  // Credenciais de conexão — pegue a URL do .env
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
