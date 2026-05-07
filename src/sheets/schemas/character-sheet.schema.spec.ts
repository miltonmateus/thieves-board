import {
  characterSheetSchema,
  updateCharacterSheetSchema,
} from './character-sheet.schema';

describe('characterSheetSchema', () => {
  const validCharacterSheet = {
    nome: ' Arkon\nValedouro ',
    jogador: 'Milton',
    dataCriacao: '06/05/2026',
    aparencia: 'Humano alto',
    cenario: 'ANGEA',
    ncd: 1,
    nct: 2,
    historia: 'Um viajante das pontes antigas.',
    tamanho: {
      x: 1,
      y: 2,
    },
    altura: 1.82,
    cm: 3,
    pp: 10,
    ppParaGastar: 4,
    capacidadesFisicas: {
      pv: {
        maximo: 20,
        metade: 10,
        atual: 18,
      },
      pf: {
        maximo: 12,
        metade: 6,
        atual: 9,
      },
      ex: {
        maximo: 8,
        metade: 4,
        atual: 2,
      },
      velocidadeBase: 9,
      velocidadeCorrida: 18,
      reflexo: 2,
      baseCarga: 10,
      fatorCarga: 2,
      defesas: [1, null, 3],
    },
    atributos: {
      fo: {
        base: 1,
        atual: 2,
        comCm: 3,
      },
      de: {
        base: 0,
        atual: 1,
      },
      it: {
        base: -1,
        atual: 0,
      },
      co: {
        base: 2,
        atual: 3,
        comCm: 3,
      },
    },
    competencias: {
      linguistica: 1,
      logica: 2,
      espacial: 0,
      cinestesica: 3,
      interpessoal: null,
      intrapessoal: 1,
      naturalista: 2,
      musical: 0,
      exotica: null,
    },
    memoriasCanonicas: ['Primeira memória'],
    marcasPessoais: ['Cicatriz no braço'],
    inventario: [
      {
        nome: 'Espada Longa',
        valor: 50,
        peso: 2,
      },
      {
        nome: 'Lâmina do Braseiro',
        valor: null,
        peso: 1.8,
        tipo: 'item-magico',
        fichaItemMagicoId: '507f1f77bcf86cd799439011',
      },
    ],
    anotacoes: 'Mantém vigília à noite.',
  };

  it('should accept a complete character sheet and apply defaults', () => {
    expect(characterSheetSchema.parse(validCharacterSheet)).toEqual({
      sistema: 't13',
      ...validCharacterSheet,
      nome: 'Arkon Valedouro',
      inventario: [
        {
          nome: 'Espada Longa',
          valor: 50,
          peso: 2,
          tipo: 'item-comum',
        },
        validCharacterSheet.inventario[1],
      ],
    });
  });

  it('should reject unknown keys and out-of-range values', () => {
    expect(
      characterSheetSchema.safeParse({
        ...validCharacterSheet,
        extra: true,
      }).success,
    ).toBe(false);
    expect(
      characterSheetSchema.safeParse({
        ...validCharacterSheet,
        atributos: {
          ...validCharacterSheet.atributos,
          fo: {
            ...validCharacterSheet.atributos.fo,
            base: 4,
          },
        },
      }).success,
    ).toBe(false);
    expect(
      characterSheetSchema.safeParse({
        ...validCharacterSheet,
        inventario: [
          {
            nome: 'Carga negativa',
            valor: 1,
            peso: -1,
          },
        ],
      }).success,
    ).toBe(false);
  });

  it('should allow nested partial updates but reject empty update payloads', () => {
    expect(
      updateCharacterSheetSchema.parse({
        capacidadesFisicas: {
          pv: {
            atual: 12,
          },
        },
        atributos: {
          fo: {
            comCm: 2,
          },
        },
      }),
    ).toEqual({
      capacidadesFisicas: {
        pv: {
          atual: 12,
        },
      },
      atributos: {
        fo: {
          comCm: 2,
        },
      },
    });

    expect(updateCharacterSheetSchema.safeParse({}).success).toBe(false);
  });
});
