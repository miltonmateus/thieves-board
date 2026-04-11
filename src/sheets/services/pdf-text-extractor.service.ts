import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class PdfTextExtractorService {
  async extractText(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    return result.text;
  }
}