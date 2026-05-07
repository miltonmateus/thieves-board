import { MagicItemSheetSource } from '../../enums/magic-item-sheets/magic-item-sheet-source.enum';
import { MagicItemSheetTypeDetector } from './magic-item-sheet-type.detector';

describe('MagicItemSheetTypeDetector', () => {
  const detector = new MagicItemSheetTypeDetector();

  it('should identify T13 magic item sheets when enough signals are present', () => {
    expect(
      detector.detect(`
        Ficha de Item Mágico
        Nome do item
        Categoria de Poder
      `),
    ).toBe(MagicItemSheetSource.T13);
  });

  it('should normalize whitespace before matching signals', () => {
    expect(
      detector.detect(
        'Ficha\u00A0de\u00A0Item\u00A0Mágico\r\nPontos de Fadiga / Atuais\r\nDescrição da Alma',
      ),
    ).toBe(MagicItemSheetSource.T13);
  });

  it('should return unknown when there are not enough signals', () => {
    expect(detector.detect('Texto sem formato conhecido')).toBe(
      MagicItemSheetSource.Unknown,
    );
  });
});
