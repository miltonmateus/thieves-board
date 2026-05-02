import { SheetsService } from './sheets.service';

describe('SheetsService', () => {
  const characterSheetModel = {
    collection: { name: 'charactersheets' },
  };
  const magicItemSheetModel = {
    create: jest.fn(),
  };
  const characterSheetParser = {
    parse: jest.fn(),
  };
  const magicItemSheetParser = {
    parse: jest.fn(),
  };
  const pdfTextExtractorService = {
    extractText: jest.fn(),
  };
  const pdfOcrService = {
    extractFromImage: jest.fn(),
  };
  const characterSheetHtmlService = {
    createCharacterSheetHtml: jest.fn(),
  };
  const htmlPdfRendererService = {
    render: jest.fn(),
  };

  const service = new SheetsService(
    characterSheetModel as never,
    magicItemSheetModel as never,
    characterSheetParser as never,
    magicItemSheetParser as never,
    pdfTextExtractorService as never,
    pdfOcrService as never,
    characterSheetHtmlService as never,
    htmlPdfRendererService as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('previewMagicItemSheetFromFile', () => {
    it('should extract text from a PDF and parse the magic item sheet', async () => {
      const buffer = Buffer.from('pdf-content');
      const extractedText = `
        Ficha de Item Mágico
        ANGEA Nome do item
        Data de Criação:28/04/2026
        Lâmina do Braseiro Sereno
        Categoria de Poder
        Fogo / Natureza - Relíquia Menor
        Estável
        Situação Atual
      `;
      const parsedSheet = {
        nome: 'Lâmina do Braseiro Sereno',
        dataCriacao: '28/04/2026',
        categoriaPoder: 'Fogo / Natureza - Relíquia Menor',
        situacaoAtual: 'Estável',
      };

      pdfTextExtractorService.extractText.mockResolvedValue(extractedText);
      magicItemSheetParser.parse.mockReturnValue(parsedSheet);

      await expect(
        service.previewMagicItemSheetFromFile(buffer, 'application/pdf'),
      ).resolves.toEqual({
        extractedText,
        parsedSheet,
      });

      expect(pdfTextExtractorService.extractText).toHaveBeenCalledWith(buffer);
      expect(magicItemSheetParser.parse).toHaveBeenCalledWith(extractedText);
    });
  });

  describe('parseMagicItemSheetFromFile', () => {
    it('should extract text from a file and return the parsed magic item sheet', async () => {
      const buffer = Buffer.from('pdf-content');
      const extractedText = 'Ficha de Item Mágico';
      const parsedSheet = {
        nome: 'Lâmina do Braseiro Sereno',
        dataCriacao: '28/04/2026',
        categoriaPoder: 'Fogo / Natureza - Relíquia Menor',
        situacaoAtual: 'Estável',
      };

      pdfTextExtractorService.extractText.mockResolvedValue(extractedText);
      magicItemSheetParser.parse.mockReturnValue(parsedSheet);

      await expect(
        service.parseMagicItemSheetFromFile(buffer, 'application/pdf'),
      ).resolves.toEqual(parsedSheet);

      expect(pdfTextExtractorService.extractText).toHaveBeenCalledWith(buffer);
      expect(magicItemSheetParser.parse).toHaveBeenCalledWith(extractedText);
    });
  });

  describe('parseAndSaveMagicItemSheetFromFile', () => {
    it('should parse a magic item sheet from file and save it', async () => {
      const buffer = Buffer.from('pdf-content');
      const extractedText = 'Ficha de Item Mágico';
      const parsedSheet = {
        nome: 'Lâmina do Braseiro Sereno',
        dataCriacao: '28/04/2026',
        categoriaPoder: 'Fogo / Natureza - Relíquia Menor',
        situacaoAtual: 'Estável',
      };
      const createdSheet = {
        _id: 'magic-item-id',
        ...parsedSheet,
      };

      pdfTextExtractorService.extractText.mockResolvedValue(extractedText);
      magicItemSheetParser.parse.mockReturnValue(parsedSheet);
      magicItemSheetModel.create.mockResolvedValue(createdSheet);

      await expect(
        service.parseAndSaveMagicItemSheetFromFile(buffer, 'application/pdf'),
      ).resolves.toEqual(createdSheet);

      expect(pdfTextExtractorService.extractText).toHaveBeenCalledWith(buffer);
      expect(magicItemSheetParser.parse).toHaveBeenCalledWith(extractedText);
      expect(magicItemSheetModel.create).toHaveBeenCalledWith(parsedSheet);
    });
  });
});
