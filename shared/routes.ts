import { z } from 'zod';
import { insertCommandSchema, commands } from './schema';

export const api = {
  commands: {
    list: {
      method: 'GET' as const,
      path: '/api/commands',
      responses: {
        200: z.array(z.custom<typeof commands.$inferSelect>()),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
