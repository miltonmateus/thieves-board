import { BadRequestException } from '@nestjs/common';
import { T13CharacterSheetParser } from './t13-character-sheet.parser';

describe('T13CharacterSheetParser', () => {
  const parser = new T13CharacterSheetParser();

  it('should parse character sheet text correctly', () => {
    const result = parser.parse(`
      Nome: Arkon
      Jogador: Milton

      - Espada Longa
      - Armadura de Couro
    `);

    expect(result.nome).toBe('Arkon');
  });

  it('should parse formatted fields, inventory and personal marks', () => {
    const result = parser.parse(`
      Ficha de Personagem
      Nome: Arkon T13
      Jogador: Milton
      Data de Criação: 06 / 05 / 2026 PP: 10 PP p/ gastar: 4
      Aparência: Humano de manto azul Cenário: ANGEA NCD: 1 NCT: 2
      História:
      Primeira linha da história.
      Segunda linha com [PP] ruído.
      Tamanho: 1,5 x 2 Altura: 1,82 CM: 3

      Inventário
      - Espada Longa
      - __Armadura de Couro__
      MARCAS PESSOAIS
      - Cicatriz no braço
      - Medalhão antigo ok»

      Anotações:
      T13 Observa as pontes antigas.
    `);

    expect(result).toMatchObject({
      nome: 'Arkon',
      jogador: 'Milton',
      dataCriacao: '06/05/2026',
      pp: 10,
      ppParaGastar: 4,
      aparencia: 'Humano de manto azul',
      cenario: 'ANGEA',
      ncd: 1,
      nct: 2,
      historia: 'Primeira linha da história. Segunda linha com ruído.',
      tamanho: {
        x: 1.5,
        y: 2,
      },
      altura: 1.82,
      cm: 3,
      inventario: [
        {
          nome: 'Espada Longa',
          valor: null,
          peso: null,
          tipo: 'item-comum',
          fichaItemMagicoId: null,
        },
        {
          nome: 'Armadura de Couro',
          valor: null,
          peso: null,
          tipo: 'item-comum',
          fichaItemMagicoId: null,
        },
      ],
      marcasPessoais: ['Cicatriz no braço', 'Medalhão antigo ok»'],
      anotacoes: 'Observa as pontes antigas.',
    });
  });

  it('should split combined inventory and personal marks sections', () => {
    const result = parser.parse(`
      Ficha de Personagem
      Nome: Lira Jogador: Ana
      Data de Criação: // PP: abc PP p/ gastar:
      Aparência: ____ Cenário:
      NCD: ruim NCT:
      História:
      Tamanho: x Altura:
      CM:
      Inventário MARCAS PESSOAIS
      Espada Longa - Cicatriz no rosto
      Corda - ok»
      o Tocha 0 Marca de nascença
      rmDD1
      123
      Anotações:
    `);

    expect(result.dataCriacao).toBeUndefined();
    expect(result.pp).toBeNull();
    expect(result.ncd).toBeNull();
    expect(result.inventario).toEqual([
      {
        nome: 'Espada Longa',
        valor: null,
        peso: null,
        tipo: 'item-comum',
        fichaItemMagicoId: null,
      },
      {
        nome: 'Corda -',
        valor: null,
        peso: null,
        tipo: 'item-comum',
        fichaItemMagicoId: null,
      },
      {
        nome: 'Tocha',
        valor: null,
        peso: null,
        tipo: 'item-comum',
        fichaItemMagicoId: null,
      },
    ]);
    expect(result.marcasPessoais).toEqual([
      'Cicatriz no rosto',
      'Marca de nascença',
    ]);
  });

  it('should ignore noisy combined sections and keep standalone items', () => {
    const result = parser.parse(`
      Ficha de Personagem
      Nome: Nara Jogador: Bia
      Inventário MARCAS PESSOAIS
      Corda
      :
      -
      tu)
      Anotações:
    `);

    expect(result.inventario).toEqual([
      {
        nome: 'Corda',
        valor: null,
        peso: null,
        tipo: 'item-comum',
        fichaItemMagicoId: null,
      },
    ]);
    expect(result.marcasPessoais).toEqual([]);
  });

  it('should fall back to default lists when list sections contain only separators', () => {
    const result = parser.parse(`
      Ficha de Personagem
      Nome: Nara Jogador: Bia
      Inventário MARCAS PESSOAIS
      rmDD1
      tu)
      Anotações:
    `);

    expect(result.inventario).toEqual([]);
    expect(result.marcasPessoais).toEqual(['rmDD1', 'tu)']);
  });

  it('should ignore standalone inventory sections without valid items', () => {
    const result = parser.parse(`
      Ficha de Personagem
      Nome: Nara Jogador: Bia
      Inventário
      :
      -
      MARCAS PESSOAIS
      Anotações:
    `);

    expect(result.inventario).toEqual([]);
  });

  it('should reject parsed data that fails schema validation', () => {
    expect(() =>
      parser.parse(`
        Nome: Arkon Jogador: Milton
        Data de Criação: ontem PP: 1 PP p/ gastar: 1
        Tamanho: 1 x 1 Altura: 1 CM: 1
      `),
    ).toThrow(BadRequestException);
  });
});
