import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const commands = pgTable("commands", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  language: text("language").notNull(), // 'en' | 'de'
  filename: text("filename").notNull(),
});

export const insertCommandSchema = createInsertSchema(commands).omit({ id: true });

export type Command = typeof commands.$inferSelect;
export type InsertCommand = z.infer<typeof insertCommandSchema>;
