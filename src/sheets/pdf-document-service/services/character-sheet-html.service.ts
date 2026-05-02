import { Injectable } from '@nestjs/common';
import type { CharacterSheet } from '../../schemas/character-sheet.schema';
import { createT13CharacterSheetHtmlTemplate } from '../systems/T13/templates/character-sheet-html.template';

@Injectable()
export class CharacterSheetHtmlService {
  createCharacterSheetHtml(data: CharacterSheet): string {
    return createT13CharacterSheetHtmlTemplate(data);
  }
}
