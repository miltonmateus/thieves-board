import { z } from 'zod';

export const mongoObjectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'ID inválido.');

export type MongoObjectId = z.infer<typeof mongoObjectIdSchema>;
