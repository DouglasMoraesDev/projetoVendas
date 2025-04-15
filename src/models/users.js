// src/models/users.js
const { mysqlTable, int, varchar, timestamp } = require('drizzle-orm/mysql-core');

const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow()
});

module.exports = { users };
