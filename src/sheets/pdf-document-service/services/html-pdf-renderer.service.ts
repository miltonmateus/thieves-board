import { Injectable, NotImplementedException } from '@nestjs/common';

export type HtmlPdfRenderOptions = {
  format?: 'A4' | 'Letter';
  landscape?: boolean;
  printBackground?: boolean;
};

@Injectable()
export class HtmlPdfRendererService {
  render(html: string, options: HtmlPdfRenderOptions = {}): Promise<Buffer> {
    void html;
    void options;

    throw new NotImplementedException(
      'Renderização HTML para PDF ainda não configurada. Instale e conecte um renderer como Playwright/Chromium neste serviço.',
    );
  }
}
