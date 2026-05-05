import { integer, pgTable, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const streaksTable = pgTable('streaks', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  currentStreak: integer('current_streak').default(0).notNull(),
  lastLogin: timestamp('last_login'),
});

export const habitsTable = pgTable('habits', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 500 }),
  active: boolean().default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

