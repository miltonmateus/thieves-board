import { CharacterSheetParser } from './character-sheet.parser';

describe('CharacterSheetParser', () => {
  it('should parse character sheet text correctly', () => {
    const parser = new CharacterSheetParser();

    const result = parser.parse(`
      Nome: Arkon
      Jogador: Milton

      - Espada Longa
      - Armadura de Couro
    `);

    expect(result.nome).toBe('Arkon');
  });
});
