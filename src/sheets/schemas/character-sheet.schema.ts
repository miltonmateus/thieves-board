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

const nullableNumberSchema = z.number().nullable();

const nullableIntegerSchema = z.number().int().nullable();

const nullableObjectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i)
  .nullable();

const nullableAttributeSchema = z.number().int().min(-3).max(3).nullable();

const nullableCompetenceSchema = z.number().int().min(0).max(3).nullable();

const sizeSchema = z
  .object({
    x: nonNegativeNullableNumberSchema,
    y: nonNegativeNullableNumberSchema,
  })
  .strict();

const resourceSchema = z
  .object({
    maximo: nonNegativeNullableNumberSchema,
    metade: nonNegativeNullableNumberSchema,
    atual: nonNegativeNullableNumberSchema,
  })
  .strict();

const physicalCapacitiesSchema = z
  .object({
    pv: resourceSchema,
    pf: resourceSchema,
    ex: resourceSchema,
    velocidadeBase: nonNegativeNullableNumberSchema,
    velocidadeCorrida: nonNegativeNullableNumberSchema,
    reflexo: nonNegativeNullableNumberSchema,
    baseCarga: nonNegativeNullableNumberSchema,
    fatorCarga: nonNegativeNullableNumberSchema,
    defesas: z.array(nullableIntegerSchema),
  })
  .strict();

const attributeSchema = z
  .object({
    base: nullableAttributeSchema,
    atual: nullableAttributeSchema,
  })
  .strict();

const attributeWithMagnitudeSchema = attributeSchema
  .extend({
    comCm: nullableIntegerSchema,
  })
  .strict();

const attributesSchema = z
  .object({
    fo: attributeWithMagnitudeSchema,
    de: attributeSchema,
    it: attributeSchema,
    co: attributeWithMagnitudeSchema,
  })
  .strict();

const competencesSchema = z
  .object({
    linguistica: nullableCompetenceSchema,
    logica: nullableCompetenceSchema,
    espacial: nullableCompetenceSchema,
    cinestesica: nullableCompetenceSchema,
    interpessoal: nullableCompetenceSchema,
    intrapessoal: nullableCompetenceSchema,
    naturalista: nullableCompetenceSchema,
    musical: nullableCompetenceSchema,
    exotica: nullableCompetenceSchema,
  })
  .strict();

const inventoryItemSchema = z
  .object({
    nome: optionalTextSchema,
    valor: nullableNumberSchema,
    peso: nonNegativeNullableNumberSchema,
    tipo: z.enum(['item-comum', 'item-magico']).default('item-comum'),
    fichaItemMagicoId: nullableObjectIdSchema.optional(),
  })
  .strict();

const brazilianDateSchema = z
  .string()
  .trim()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/)
  .optional();

export const characterSheetSchema = z
  .object({
    sistema: z.literal('t13').default('t13'),

    nome: optionalTextSchema,
    jogador: optionalTextSchema,

    dataCriacao: brazilianDateSchema,

    aparencia: optionalTextSchema,
    cenario: optionalTextSchema,
    ncd: nonNegativeNullableNumberSchema,
    nct: nonNegativeNullableNumberSchema,
    historia: optionalTextSchema,

    tamanho: sizeSchema,

    altura: nonNegativeNullableNumberSchema,

    cm: nonNegativeNullableNumberSchema,

    pp: nonNegativeNullableNumberSchema,
    ppParaGastar: nonNegativeNullableNumberSchema,

    capacidadesFisicas: physicalCapacitiesSchema,
    atributos: attributesSchema,
    competencias: competencesSchema,
    memoriasCanonicas: stringListSchema,
    marcasPessoais: stringListSchema,
    inventario: z.array(inventoryItemSchema),

    anotacoes: optionalTextSchema,
  })
  .strict();

export type CharacterSheet = z.infer<typeof characterSheetSchema>;

export const updateCharacterSheetSchema = characterSheetSchema
  .partial()
  .extend({
    tamanho: sizeSchema.partial().optional(),
    capacidadesFisicas: physicalCapacitiesSchema
      .partial()
      .extend({
        pv: resourceSchema.partial().optional(),
        pf: resourceSchema.partial().optional(),
        ex: resourceSchema.partial().optional(),
      })
      .optional(),
    atributos: attributesSchema
      .partial()
      .extend({
        fo: attributeWithMagnitudeSchema.partial().optional(),
        de: attributeSchema.partial().optional(),
        it: attributeSchema.partial().optional(),
        co: attributeWithMagnitudeSchema.partial().optional(),
      })
      .optional(),
    competencias: competencesSchema.partial().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização.',
  });

export type UpdateCharacterSheet = z.infer<typeof updateCharacterSheetSchema>;
