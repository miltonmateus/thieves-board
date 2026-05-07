import { chromium } from 'playwright';
import { HtmlPdfRendererService } from './html-pdf-renderer.service';

jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn(),
  },
}));

describe('HtmlPdfRendererService', () => {
  const chromiumMock = jest.mocked(chromium);
  const page = {
    setContent: jest.fn(),
    pdf: jest.fn(),
    close: jest.fn(),
  };
  const browser = {
    newPage: jest.fn(),
    close: jest.fn(),
    isConnected: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    browser.newPage.mockResolvedValue(page);
    browser.isConnected.mockReturnValue(true);
    page.pdf.mockResolvedValue(Buffer.from('pdf'));
    chromiumMock.launch.mockResolvedValue(browser as never);
  });

  it('should render html as pdf and close the page', async () => {
    const service = new HtmlPdfRendererService();

    await expect(
      service.render('<html></html>', {
        format: 'Letter',
        landscape: true,
        printBackground: false,
      }),
    ).resolves.toEqual(Buffer.from('pdf'));

    expect(chromiumMock.launch.mock.calls[0]?.[0]).toEqual({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    expect(page.setContent).toHaveBeenCalledWith('<html></html>', {
      waitUntil: 'networkidle',
    });
    expect(page.pdf).toHaveBeenCalledWith({
      format: 'Letter',
      landscape: true,
      printBackground: false,
    });
    expect(page.close).toHaveBeenCalled();
  });

  it('should reuse a connected browser and close it on module destroy', async () => {
    const service = new HtmlPdfRendererService();

    await service.render('<html>one</html>');
    await service.render('<html>two</html>');
    await service.onModuleDestroy();

    expect(chromiumMock.launch.mock.calls).toHaveLength(1);
    expect(browser.close).toHaveBeenCalled();
  });

  it('should relaunch the browser when the cached browser is disconnected', async () => {
    const service = new HtmlPdfRendererService();

    browser.isConnected.mockReturnValueOnce(false);
    await service.render('<html>one</html>');
    await service.render('<html>two</html>');

    expect(chromiumMock.launch.mock.calls).toHaveLength(2);
  });
});
