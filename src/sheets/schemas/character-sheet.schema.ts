import { z } from 'zod';

export const characterSheetSchema = z.object({
  nome: z.string().optional(),
  jogador: z.string().optional(),

  dataCriacao: z.string().optional(),

  aparencia: z.string().optional(),
  cenario: z.string().optional(),
  historia: z.string().optional(),

  tamanho: z.object({
    largura: z.number().nullable(),
    altura: z.number().nullable(),
  }),

  altura: z.number().nullable(),
  peso: z.number().nullable(),

  cm: z.number().nullable(),

  pp: z.number().nullable(),
  ppParaGastar: z.number().nullable(),

  inventario: z.array(z.string()),
  marcasPessoais: z.array(z.string()),

  anotacoes: z.string().optional(),
});

export type CharacterSheet = z.infer<typeof characterSheetSchema>;

export const updateCharacterSheetSchema = characterSheetSchema.partial();

export type UpdateCharacterSheet = z.infer<typeof updateCharacterSheetSchema>;
