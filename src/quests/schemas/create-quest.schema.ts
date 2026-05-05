import { z } from 'zod';

const textSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) => value.replace(/\s{2,}/g, ' ').trim());

export const createQuestSchema = z
  .object({
    name: textSchema,
    description: z.string().trim().min(1),
  })
  .strict();

export type CreateQuestInput = z.infer<typeof createQuestSchema>;
