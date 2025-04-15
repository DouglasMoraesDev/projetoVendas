// src/models/comprovantes.js
const { mysqlTable, int, longtext, timestamp } = require('drizzle-orm/mysql-core');

const comprovantes = mysqlTable('comprovantes', {
  id: int('id').primaryKey().autoincrement(),
  venda_id: int('venda_id').notNull(),
  imagem: longtext('imagem').notNull(),
  created_at: timestamp('created_at').defaultNow()
});

module.exports = { comprovantes };
