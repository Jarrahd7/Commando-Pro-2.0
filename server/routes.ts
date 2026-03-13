import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.commands.list.path, async (req, res) => {
    const commands = await storage.getCommands();
    res.json(commands);
  });

  // Initial seed
  await storage.seedCommands();

  return httpServer;
}
