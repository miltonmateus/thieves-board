import { characterSheetSchema } from '../../../../schemas/character-sheet.schema';
import { createNewT13CharacterSheet } from './new-sheet.template';

describe('createNewT13CharacterSheet', () => {
  it('should create a valid blank T13 character sheet', () => {
    const sheet = createNewT13CharacterSheet();

    expect(characterSheetSchema.safeParse(sheet).success).toBe(true);
    expect(sheet).toMatchObject({
      sistema: 't13',
      tamanho: { x: null, y: null },
      inventario: [],
      marcasPessoais: [],
    });
  });
});
