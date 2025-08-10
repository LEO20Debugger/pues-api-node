import {
  mysqlTable,
  serial,
  varchar,
  text,
  datetime,
  timestamp,
  tinyint,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const adminUsers = mysqlTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).onUpdateNow(),
  deleted: tinyint('deleted').default(0).notNull(),
  deletedAt: timestamp('deleted_at', { mode: 'string' }),
});

export const projects = mysqlTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  completedAt: timestamp('completed_at', { mode: 'string' }),
  updatedat: timestamp('updated_at', { mode: 'string' }).onUpdateNow(),
  deletedat: timestamp('deleted_at', { mode: 'string' }),
  deleted: tinyint('deleted').default(0).notNull(),
});

export const contacts = mysqlTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  message: text('message').notNull(),
  createdat: timestamp('created_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedat: timestamp('updated_at', { mode: 'string' }).onUpdateNow(),
  deletedat: timestamp('deleted_at', { mode: 'string' }),
  deleted: tinyint('deleted').default(0).notNull(),
});
