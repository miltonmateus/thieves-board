import { PDFParse } from 'pdf-parse';
import { PdfTextExtractorService } from './pdf-text-extractor.service';

jest.mock('pdf-parse', () => ({
  PDFParse: jest.fn(),
}));

describe('PdfTextExtractorService', () => {
  const ocrService = {
    extract: jest.fn(),
  };
  const service = new PdfTextExtractorService(ocrService as never);
  const getText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (PDFParse as unknown as jest.Mock).mockImplementation(() => ({ getText }));
  });

  it('should return embedded pdf text when enough text is extracted', async () => {
    const text = 'x'.repeat(51);
    getText.mockResolvedValue({ text: ` ${text} ` });

    await expect(service.extractText(Buffer.from('pdf'))).resolves.toBe(text);
    expect(ocrService.extract).not.toHaveBeenCalled();
  });

  it('should fall back to OCR when embedded text is too short', async () => {
    getText.mockResolvedValue({ text: 'curto' });
    ocrService.extract.mockResolvedValue('texto via ocr');

    await expect(service.extractText(Buffer.from('pdf'))).resolves.toBe(
      'texto via ocr',
    );
  });

  it('should fall back to OCR when embedded text is missing', async () => {
    getText.mockResolvedValue({});
    ocrService.extract.mockResolvedValue('texto via ocr');

    await expect(service.extractText(Buffer.from('pdf'))).resolves.toBe(
      'texto via ocr',
    );
  });

  it('should fall back to OCR when pdf parsing fails', async () => {
    getText.mockRejectedValue(new Error('parse failed'));
    ocrService.extract.mockResolvedValue('texto via ocr');

    await expect(service.extractText(Buffer.from('pdf'))).resolves.toBe(
      'texto via ocr',
    );
  });
});
