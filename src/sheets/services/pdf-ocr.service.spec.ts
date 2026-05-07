import Tesseract from 'tesseract.js';
import * as fs from 'fs/promises';
import { PdfOcrService } from './pdf-ocr.service';

jest.mock('tesseract.js', () => ({
  recognize: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  unlink: jest.fn(),
}));

describe('PdfOcrService', () => {
  const converter = {
    convert: jest.fn(),
  };
  const service = new PdfOcrService(converter as never);

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.unlink as jest.Mock).mockResolvedValue(undefined);
  });

  it('should extract text from converted pdf images and remove temporary files', async () => {
    converter.convert.mockResolvedValue(['/tmp/page-1.png', '/tmp/page-2.png']);
    (Tesseract.recognize as jest.Mock)
      .mockResolvedValueOnce({ data: { text: 'Página 1' } })
      .mockResolvedValueOnce({ data: { text: 'Página 2' } });

    await expect(service.extract(Buffer.from('pdf'))).resolves.toBe(
      'Página 1\nPágina 2\n',
    );
    expect(fs.unlink).toHaveBeenCalledWith('/tmp/page-1.png');
    expect(fs.unlink).toHaveBeenCalledWith('/tmp/page-2.png');
  });

  it('should clean temporary files even when OCR fails', async () => {
    converter.convert.mockResolvedValue(['/tmp/page-1.png']);
    (Tesseract.recognize as jest.Mock).mockRejectedValue(
      new Error('ocr failed'),
    );

    await expect(service.extract(Buffer.from('pdf'))).rejects.toThrow(
      'ocr failed',
    );
    expect(fs.unlink).toHaveBeenCalledWith('/tmp/page-1.png');
  });

  it('should extract text directly from images', async () => {
    (Tesseract.recognize as jest.Mock).mockResolvedValue({
      data: { text: 'Texto da imagem' },
    });

    await expect(service.extractFromImage(Buffer.from('image'))).resolves.toBe(
      'Texto da imagem',
    );
    expect(Tesseract.recognize).toHaveBeenCalledWith(
      Buffer.from('image'),
      'por',
    );
  });
});
