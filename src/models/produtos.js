// src/models/produtos.js
const { mysqlTable, int, varchar, decimal, timestamp } = require('drizzle-orm/mysql-core');

const produtos = mysqlTable('produtos', {
  id: int('id').primaryKey().autoincrement(),
  nome: varchar('nome', { length: 100 }).notNull(),
  preco: decimal('preco', { precision: 10, scale: 2 }).notNull(),
  qtd: int('qtd').notNull(),
  foto: varchar('foto', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow()
});

module.exports = { produtos };
