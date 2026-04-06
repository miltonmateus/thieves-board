import { z } from 'zod';

export const rollDiceSchema = z.object({
  diceId: z
    .string({
      error: 'diceId deve ser uma string',
    })
    .min(1, 'diceId é obrigatório'),

  quantity: z
    .number({
      error: 'quantity deve ser um número',
    })
    .int('quantity deve ser inteiro')
    .min(1, 'quantity deve ser no mínimo 1')
    .max(10, 'quantity deve ser no máximo 10')
    .default(1),
});

export type RollDiceSchema = z.infer<typeof rollDiceSchema>;
