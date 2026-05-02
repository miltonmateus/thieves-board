import type { CharacterSheet } from '../../../../schemas/character-sheet.schema';

export function createNewT13CharacterSheet(): CharacterSheet {
  return {
    sistema: 't13',

    nome: undefined,
    jogador: undefined,
    dataCriacao: undefined,

    aparencia: undefined,
    cenario: undefined,
    ncd: null,
    nct: null,
    historia: undefined,

    tamanho: {
      x: null,
      y: null,
    },

    altura: null,
    cm: null,

    pp: null,
    ppParaGastar: null,

    capacidadesFisicas: {
      pv: { maximo: null, metade: null, atual: null },
      pf: { maximo: null, metade: null, atual: null },
      ex: { maximo: null, metade: null, atual: null },
      velocidadeBase: null,
      velocidadeCorrida: null,
      reflexo: null,
      baseCarga: null,
      fatorCarga: null,
      defesas: [],
    },
    atributos: {
      fo: { base: null, atual: null, comCm: null },
      de: { base: null, atual: null },
      it: { base: null, atual: null },
      co: { base: null, atual: null, comCm: null },
    },
    competencias: {
      linguistica: null,
      logica: null,
      espacial: null,
      cinestesica: null,
      interpessoal: null,
      intrapessoal: null,
      naturalista: null,
      musical: null,
      exotica: null,
    },
    memoriasCanonicas: [],
    marcasPessoais: [],
    inventario: [],

    anotacoes: undefined,
  };
}
