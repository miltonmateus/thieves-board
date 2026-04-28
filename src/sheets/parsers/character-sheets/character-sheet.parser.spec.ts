import { T13CharacterSheetParser } from './t13-character-sheet.parser';

describe('T13CharacterSheetParser', () => {
  it('should parse character sheet text correctly', () => {
    const parser = new T13CharacterSheetParser();

    const result = parser.parse(`
      Nome: Arkon
      Jogador: Milton

      - Espada Longa
      - Armadura de Couro
    `);

    expect(result.nome).toBe('Arkon');
  });
});
