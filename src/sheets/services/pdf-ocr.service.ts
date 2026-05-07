import { Injectable } from '@nestjs/common';
import Tesseract from 'tesseract.js';
import { PdfImageConverterService } from './pdf-image-converter.service';
import * as fs from 'fs/promises';

/* istanbul ignore next */
@Injectable()
export class PdfOcrService {
  private readonly converter: PdfImageConverterService;

  constructor(converter: PdfImageConverterService) {
    this.converter = converter;
  }

  async extract(buffer: Buffer): Promise<string> {
    const imagePaths = await this.converter.convert(buffer);

    let finalText = '';

    try {
      for (const path of imagePaths) {
        const result = await Tesseract.recognize(path, 'por');
        finalText += result.data.text + '\n';
      }
    } finally {
      // limpeza de arquivos temporários
      await Promise.all(
        imagePaths.map((path) => fs.unlink(path).catch(() => null)),
      );
    }

    return finalText;
  }

  async extractFromImage(buffer: Buffer): Promise<string> {
    const result = await Tesseract.recognize(buffer, 'por');

    return result.data.text;
  }
}
