// src/models/comprovantes.js
import { mysqlTable, int, longtext, timestamp } from 'drizzle-orm/mysql-core';

export const comprovantes = mysqlTable('comprovantes', {
  id: int('id').primaryKey().autoincrement(),
  venda_id: int('venda_id').notNull(),
  imagem: longtext('imagem').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});
