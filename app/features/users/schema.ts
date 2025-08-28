import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  avatar: text('avatar'),
  name: text('name').notNull(),
  userName: text('user_name').notNull().unique(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});