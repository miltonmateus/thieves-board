import { z } from 'zod';

export const diceFaceSchema = z.object({
  value: z.union([z.number(), z.string()]),
  label: z.string().optional(),
});

export const diceDefinitionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['numeric', 'symbolic']),
  faces: z.array(diceFaceSchema),
  canSum: z.boolean(),
});

export type DiceDefinition = z.infer<typeof diceDefinitionSchema>;
