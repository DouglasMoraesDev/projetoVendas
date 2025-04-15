// src/models/clientes.js
const { mysqlTable, int, varchar, timestamp } = require('drizzle-orm/mysql-core');

const clientes = mysqlTable('clientes', {
  id: int('id').primaryKey().autoincrement(),
  nome: varchar('nome', { length: 100 }).notNull(),
  cpf: varchar('cpf', { length: 20 }).notNull(),
  endereco: varchar('endereco', { length: 255 }).notNull(),
  contato: varchar('contato', { length: 50 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow()
});

module.exports = { clientes };
