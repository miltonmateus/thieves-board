import { BadRequestException, Injectable } from '@nestjs/common';
import { CharacterSheetTypeDetector } from '../../detectors/character-sheets/character-sheet-type.detector';
import { CharacterSheetSource } from '../../enums/character-sheets/character-sheet-source.enum';
import type { CharacterSheet } from '../../schemas/character-sheet.schema';
import { T13CharacterSheetParser } from './t13-character-sheet.parser';

/* istanbul ignore next */
@Injectable()
export class CharacterSheetParser {
  private readonly characterSheetTypeDetector: CharacterSheetTypeDetector;
  private readonly t13CharacterSheetParser: T13CharacterSheetParser;

  constructor(
    characterSheetTypeDetector: CharacterSheetTypeDetector,
    t13CharacterSheetParser: T13CharacterSheetParser,
  ) {
    this.characterSheetTypeDetector = characterSheetTypeDetector;
    this.t13CharacterSheetParser = t13CharacterSheetParser;
  }

  parse(text: string): CharacterSheet {
    const source = this.characterSheetTypeDetector.detect(text);

    switch (source) {
      case CharacterSheetSource.T13:
        return this.t13CharacterSheetParser.parse(text);
      default:
        throw new BadRequestException(
          'Não foi possível identificar o tipo da ficha enviada.',
        );
    }
  }
}
