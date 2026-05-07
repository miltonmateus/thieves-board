import {
  magicItemSheetSchema,
  updateMagicItemSheetSchema,
} from './magic-item-sheet.schema';

describe('magicItemSheetSchema', () => {
  const validMagicItemSheet = {
    nome: ' Lâmina   do Braseiro\nSereno ',
    dataCriacao: '28/04/2026',
    categoriaPoder: 'Fogo / Natureza - Relíquia Menor',
    situacaoAtual: 'Estável',
    pontosFadiga: {
      maximos: 12,
      atuais: 10,
    },
    nivelSintonia: 1,
    tracoConsciencia: 'Protetora e curiosa',
    peso: '1,8 kg',
    material: 'Aço negro e âmbar',
    dano: '2d6 corte + 1 fogo',
    alcance: 'Corpo a corpo',
    descricaoAlma: 'Uma pequena fênix adormecida.',
    poderPrincipal: 'Acende por 3 rodadas.',
    instabilidadesRiscos: 'Solta faíscas inquietas.',
    efeitosPassivos: 'Sempre morna ao toque.',
    historico: 'Forjada durante uma vigília de inverno.',
  };

  it('should accept and normalize a complete magic item sheet', () => {
    expect(magicItemSheetSchema.parse(validMagicItemSheet)).toEqual({
      ...validMagicItemSheet,
      nome: 'Lâmina do Braseiro Sereno',
    });
  });

  it('should reject invalid dates, fatigue points and attunement levels', () => {
    expect(
      magicItemSheetSchema.safeParse({
        ...validMagicItemSheet,
        dataCriacao: '2026-04-28',
      }).success,
    ).toBe(false);
    expect(
      magicItemSheetSchema.safeParse({
        ...validMagicItemSheet,
        pontosFadiga: { maximos: -1, atuais: 10 },
      }).success,
    ).toBe(false);
    expect(
      magicItemSheetSchema.safeParse({
        ...validMagicItemSheet,
        nivelSintonia: 4,
      }).success,
    ).toBe(false);
  });

  it('should allow partial updates but reject empty update payloads', () => {
    expect(
      updateMagicItemSheetSchema.parse({
        pontosFadiga: {
          atuais: 8,
        },
      }),
    ).toEqual({
      pontosFadiga: {
        atuais: 8,
      },
    });

    expect(updateMagicItemSheetSchema.safeParse({}).success).toBe(false);
  });
});
