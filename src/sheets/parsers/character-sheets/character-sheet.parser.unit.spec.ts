import { BadRequestException } from '@nestjs/common';
import { CharacterSheetSource } from '../../enums/character-sheets/character-sheet-source.enum';
import { CharacterSheetParser } from './character-sheet.parser';

describe('CharacterSheetParser', () => {
  const characterSheetTypeDetector = {
    detect: jest.fn(),
  };
  const t13CharacterSheetParser = {
    parse: jest.fn(),
  };
  const parser = new CharacterSheetParser(
    characterSheetTypeDetector as never,
    t13CharacterSheetParser as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate T13 sheets to the T13 parser', () => {
    const parsedSheet = { sistema: 't13', nome: 'Arkon' };
    characterSheetTypeDetector.detect.mockReturnValue(CharacterSheetSource.T13);
    t13CharacterSheetParser.parse.mockReturnValue(parsedSheet);

    expect(parser.parse('Ficha de Personagem')).toBe(parsedSheet);
    expect(t13CharacterSheetParser.parse).toHaveBeenCalledWith(
      'Ficha de Personagem',
    );
  });

  it('should reject unknown character sheets', () => {
    characterSheetTypeDetector.detect.mockReturnValue(
      CharacterSheetSource.Unknown,
    );

    expect(() => parser.parse('texto solto')).toThrow(BadRequestException);
  });
});
