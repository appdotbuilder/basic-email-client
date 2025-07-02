
import { serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const emailsTable = pgTable('emails', {
  id: serial('id').primaryKey(),
  sender: text('sender').notNull(),
  recipient: text('recipient').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  sent_at: timestamp('sent_at').defaultNow().notNull(),
});

// TypeScript type for the table schema
export type Email = typeof emailsTable.$inferSelect; // For SELECT operations
export type NewEmail = typeof emailsTable.$inferInsert; // For INSERT operations

// Important: Export all tables for proper query building
export const tables = { emails: emailsTable };
