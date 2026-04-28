import { Injectable } from '@nestjs/common';
import { CharacterSheetSource } from '../../enums/character-sheets/character-sheet-source.enum';

@Injectable()
export class CharacterSheetTypeDetector {
  detect(text: string): CharacterSheetSource {
    const normalizedText = text
      .replace(/\r/g, '')
      .replace(/\u00A0/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .trim();

    const t13Signals = [
      /Ficha\s+de\s+Personagem/i,
      /PP\s*p\/\s*gastar/i,
      /MARCAS\s+PESSOAIS/i,
      /\bCM\s*:/i,
    ];

    const matchedSignals = t13Signals.filter((signal) =>
      signal.test(normalizedText),
    );

    if (matchedSignals.length >= 2) {
      return CharacterSheetSource.T13;
    }

    return CharacterSheetSource.Unknown;
  }
}
