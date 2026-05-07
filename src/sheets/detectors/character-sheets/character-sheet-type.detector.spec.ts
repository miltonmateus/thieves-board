import { CharacterSheetSource } from '../../enums/character-sheets/character-sheet-source.enum';
import { CharacterSheetTypeDetector } from './character-sheet-type.detector';

describe('CharacterSheetTypeDetector', () => {
  const detector = new CharacterSheetTypeDetector();

  it('should identify T13 character sheets when enough signals are present', () => {
    expect(
      detector.detect(`
        Ficha   de   Personagem
        PP p/ gastar: 4
        MARCAS PESSOAIS
      `),
    ).toBe(CharacterSheetSource.T13);
  });

  it('should normalize whitespace before matching signals', () => {
    expect(
      detector.detect('Ficha\u00A0de\u00A0Personagem\r\nDados básicos CM: 2'),
    ).toBe(CharacterSheetSource.T13);
  });

  it('should return unknown when there are not enough signals', () => {
    expect(detector.detect('Ficha solta sem estrutura')).toBe(
      CharacterSheetSource.Unknown,
    );
  });
});
