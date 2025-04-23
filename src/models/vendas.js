// src/models/vendas.js
import { mysqlTable, serial, int, varchar, datetime, decimal } from 'drizzle-orm/mysql-core';

export const vendas = mysqlTable('vendas', {
  id:               serial('id').primaryKey(),
  cliente_id:       int('cliente_id').notNull(),
  produto_id:       int('produto_id').notNull(),
  qtd:               int('qtd').notNull(),                 // <-- adicionamos aqui
  cliente_name:     varchar('cliente_name', { length: 255 }).notNull(),
  produto_name:     varchar('produto_name', { length: 255 }).notNull(),
  data:             datetime('data').notNull(),
  entrada:          decimal('entrada', { precision: 10, scale: 2 }).notNull(),
  valor_total:      decimal('valor_total', { precision: 10, scale: 2 }).notNull(),
  parcelas:         int('parcelas').notNull(),
  due_day:          int('due_day').notNull(),
  paid_installments:int('paid_installments').notNull(),
  obs:              varchar('obs', { length: 255 })
});
