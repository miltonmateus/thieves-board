import { z } from 'zod';

const requiredTextSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) =>
    value
      .replace(/\s*\r?\n\s*/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim(),
  );

const brazilianDateSchema = z
  .string()
  .trim()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/);

const nonNegativeNumberSchema = z.number().nonnegative();

const fatiguePointsSchema = z
  .object({
    maximos: nonNegativeNumberSchema,
    atuais: nonNegativeNumberSchema,
  })
  .strict();

export const magicItemSheetSchema = z
  .object({
    nome: requiredTextSchema,
    dataCriacao: brazilianDateSchema,
    categoriaPoder: requiredTextSchema,
    situacaoAtual: requiredTextSchema,
    pontosFadiga: fatiguePointsSchema,
    nivelSintonia: z.number().min(-3).max(3),
    tracoConsciencia: requiredTextSchema,
    peso: requiredTextSchema,
    material: requiredTextSchema,
    dano: requiredTextSchema,
    alcance: requiredTextSchema,
    descricaoAlma: requiredTextSchema,
    poderPrincipal: requiredTextSchema,
    instabilidadesRiscos: requiredTextSchema,
    efeitosPassivos: requiredTextSchema,
    historico: requiredTextSchema,
  })
  .strict();

export type MagicItemSheet = z.infer<typeof magicItemSheetSchema>;

export const updateMagicItemSheetSchema = magicItemSheetSchema
  .partial()
  .extend({
    pontosFadiga: fatiguePointsSchema.partial().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização.',
  });

export type UpdateMagicItemSheet = z.infer<typeof updateMagicItemSheetSchema>;
