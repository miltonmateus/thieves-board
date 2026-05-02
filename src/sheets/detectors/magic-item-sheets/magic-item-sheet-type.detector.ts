import { Injectable } from '@nestjs/common';
import { MagicItemSheetSource } from '../../enums/magic-item-sheets/magic-item-sheet-source.enum';

@Injectable()
export class MagicItemSheetTypeDetector {
  detect(text: string): MagicItemSheetSource {
    const normalizedText = text
      .replace(/\r/g, '')
      .replace(/\u00A0/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .trim();

    const t13Signals = [
      /Ficha\s+de\s+Item\s+Mágico/i,
      /Nome\s+do\s+item/i,
      /Categoria\s+de\s+Poder/i,
      /Pontos\s+de\s+Fadiga\s*\/\s*Atuais/i,
      /Nível\s+de\s+Sintonia/i,
      /Traço\s+de\s+Consciência/i,
      /Descrição\s+da\s+Alma/i,
    ];

    const matchedSignals = t13Signals.filter((signal) =>
      signal.test(normalizedText),
    );

    if (matchedSignals.length >= 3) {
      return MagicItemSheetSource.T13;
    }

    return MagicItemSheetSource.Unknown;
  }
}
