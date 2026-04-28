import { BadRequestException, Injectable } from '@nestjs/common';
import { fromBuffer } from 'pdf2pic';

@Injectable()
export class PdfImageConverterService {
  async convert(buffer: Buffer): Promise<string[]> {
    const convert = fromBuffer(buffer, {
      density: 300, // qualidade (importante pro OCR)
      format: 'png',
      width: 1200,
      height: 1600,
    });

    const pages = await convert.bulk(-1); // -1 = todas as páginas

    const imagePaths = pages
      .map((page) => page.path)
      .filter((path): path is string => !!path);

    if (imagePaths.length === 0) {
      throw new BadRequestException(
        'Não foi possível converter o PDF em imagem para OCR.',
      );
    }

    return imagePaths;
  }
}
