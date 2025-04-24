import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

// No Railway, use DATABASE_URL ou, se preferir, desmembrar em DB_USER, DB_PASS etc.
const url = process.env.DATABASE_URL ??
  `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export default defineConfig({
  schema: 'src/models',      // diretório dos seus modelos Drizzle
  out: 'drizzle',           // onde serão geradas as migrations
  driver: 'mysql2',
  dbCredentials: {
    url,
  },
});