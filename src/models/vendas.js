// src/models/vendas.js
const { mysqlTable, int, decimal, varchar, date, timestamp } = require('drizzle-orm/mysql-core');

const vendas = mysqlTable('vendas', {
  id: int('id').primaryKey().autoincrement(),
  cliente_id: int('cliente_id').notNull(),
  produto_id: int('produto_id').notNull(),
  qtd: int('qtd').notNull(),
  entrada: decimal('entrada', { precision: 10, scale: 2 }).notNull(),
  parcelas: int('parcelas').notNull(),
  due_day: int('due_day').notNull(),
  paid_installments: int('paid_installments').default(0),
  obs: varchar('obs', { length: 255 }),
  data: date('data').notNull(),
  created_at: timestamp('created_at').defaultNow()
});

module.exports = { vendas };
