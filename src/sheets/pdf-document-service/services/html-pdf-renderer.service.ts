import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { chromium, type Browser } from 'playwright';

export type HtmlPdfRenderOptions = {
  format?: 'A4' | 'Letter';
  landscape?: boolean;
  printBackground?: boolean;
};

@Injectable()
export class HtmlPdfRendererService implements OnModuleDestroy {
  private browser: Browser | null = null;

  async render(
    html: string,
    options: HtmlPdfRenderOptions = {},
  ): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      await page.setContent(html, { waitUntil: 'networkidle' });

      const pdf = await page.pdf({
        format: options.format ?? 'A4',
        landscape: options.landscape ?? false,
        printBackground: options.printBackground ?? true,
      });

      return Buffer.from(pdf);
    } finally {
      await page.close();
    }
  }

  async onModuleDestroy() {
    await this.browser?.close();
    this.browser = null;
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser || !this.browser.isConnected()) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    return this.browser;
  }
}
