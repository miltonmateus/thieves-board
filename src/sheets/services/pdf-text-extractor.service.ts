import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import { PdfOcrService } from './pdf-ocr.service';

@Injectable()
export class PdfTextExtractorService {
  constructor(private readonly ocrService: PdfOcrService) {}

  async extractText(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    const text = result.text?.trim() ?? '';

    // regra principal
    if (text.length > 50) {
      return text;
    }

    // fallback OCR
    return this.ocrService.extract(buffer);
  }
}
