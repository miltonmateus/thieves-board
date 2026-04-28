import { z } from 'zod';

const optionalTextSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) =>
    value
      .replace(/\s*\r?\n\s*/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim(),
  )
  .optional();

const stringListSchema = z.array(z.string().trim().min(1));

const nonNegativeNullableNumberSchema = z.number().nonnegative().nullable();

const sizeSchema = z
  .object({
    largura: nonNegativeNullableNumberSchema,
    altura: nonNegativeNullableNumberSchema,
  })
  .strict();

const brazilianDateSchema = z
  .string()
  .trim()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/)
  .optional();

export const characterSheetSchema = z
  .object({
    nome: optionalTextSchema,
    jogador: optionalTextSchema,

    dataCriacao: brazilianDateSchema,

    aparencia: optionalTextSchema,
    cenario: optionalTextSchema,
    historia: optionalTextSchema,

    tamanho: sizeSchema,

    altura: nonNegativeNullableNumberSchema,
    peso: nonNegativeNullableNumberSchema,

    cm: nonNegativeNullableNumberSchema,

    pp: nonNegativeNullableNumberSchema,
    ppParaGastar: nonNegativeNullableNumberSchema,

    inventario: stringListSchema,
    marcasPessoais: stringListSchema,

    anotacoes: optionalTextSchema,
  })
  .strict();

export type CharacterSheet = z.infer<typeof characterSheetSchema>;

export const updateCharacterSheetSchema = characterSheetSchema
  .partial()
  .extend({
    tamanho: sizeSchema.partial().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização.',
  });

export type UpdateCharacterSheet = z.infer<typeof updateCharacterSheetSchema>;
