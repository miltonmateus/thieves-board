import type { CharacterSheet } from '../../../../schemas/character-sheet.schema';

export function createNewT13CharacterSheet(): CharacterSheet {
  return {
    nome: undefined,
    jogador: undefined,
    dataCriacao: undefined,

    aparencia: undefined,
    cenario: undefined,
    historia: undefined,

    tamanho: {
      largura: null,
      altura: null,
    },

    altura: null,
    peso: null,
    cm: null,

    pp: null,
    ppParaGastar: null,

    inventario: [],
    marcasPessoais: [],

    anotacoes: undefined,
  };
}
