import { db } from "./db";
import { commands, type Command, type InsertCommand } from "@shared/schema";

export interface IStorage {
  getCommands(): Promise<Command[]>;
  seedCommands(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCommands(): Promise<Command[]> {
    return await db.select().from(commands);
  }

  async seedCommands(): Promise<void> {
    const existing = await this.getCommands();
    if (existing.length > 0) return;

    const initialCommands: InsertCommand[] = [
      { label: "Bounce", language: "en", filename: "/audio/en_bounce.mp3" },
      { label: "Left", language: "en", filename: "/audio/en_left.mp3" },
      { label: "Right", language: "en", filename: "/audio/en_right.mp3" },
      { label: "Turn", language: "en", filename: "/audio/en_turn.mp3" },
      { label: "Klatsch", language: "de", filename: "/audio/de_klatsch.mp3" },
      { label: "Links", language: "de", filename: "/audio/de_links.mp3" },
      { label: "Rechts", language: "de", filename: "/audio/de_rechts.mp3" },
      { label: "Dreh auf", language: "de", filename: "/audio/de_dreh_auf.mp3" },
    ];

    await db.insert(commands).values(initialCommands);
  }
}

export const storage = new DatabaseStorage();
