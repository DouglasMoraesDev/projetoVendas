// drizzle.config.js
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // seu schema em SQL (ou .ts/.js se for outro formato)
  schema: './schema.sql',

  // pasta onde as migrations geradas irão
  out: './drizzle',

  // **adicionado**: dialect obrigatório para Drizzle Kit
  dialect: 'mysql',

  // se houver DATABASE_URL (Railway), usa; senão, cai nas variáveis .env
  dbCredentials: process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : {
        host:     process.env.DB_HOST,
        port:     Number(process.env.DB_PORT),
        user:     process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      },
});
