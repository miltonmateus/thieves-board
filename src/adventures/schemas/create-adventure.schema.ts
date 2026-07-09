import { z } from 'zod';

const textSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) => value.replace(/\s{2,}/g, ' ').trim());

const optionalTextSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\s{2,}/g, ' ').trim())
  .optional();

export const createAdventureSchema = z
  .object({
    name: textSchema,
    setting: textSchema,
    description: z.string().trim().min(1),
    gmNotes: optionalTextSchema,
  })
  .strict();

export type CreateAdventureInput = z.infer<typeof createAdventureSchema>;
