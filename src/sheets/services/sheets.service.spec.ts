import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createNewT13CharacterSheet } from '../pdf-document-service/systems/T13/templates/new-sheet.template';
import { SheetsService } from './sheets.service';

describe('SheetsService', () => {
  const objectId = '507f1f77bcf86cd799439011';
  const secondObjectId = '507f1f77bcf86cd799439012';

  const leanResult = (value: unknown) => ({
    lean: jest.fn().mockResolvedValue(value),
  });

  const characterSheetModel = {
    collection: { name: 'charactersheets' },
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    updateMany: jest.fn(),
  };
  const magicItemSheetModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
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

  const validCharacterSheet = createNewT13CharacterSheet();
  const validMagicItemSheet = {
    nome: 'Lâmina do Braseiro Sereno',
    dataCriacao: '28/04/2026',
    categoriaPoder: 'Fogo / Natureza - Relíquia Menor',
    situacaoAtual: 'Estável',
    pontosFadiga: {
      maximos: 12,
      atuais: 10,
    },
    nivelSintonia: 1,
    tracoConsciencia: 'Protetora e curiosa',
    peso: '1,8 kg',
    material: 'Aço negro e âmbar',
    dano: '2d6 corte + 1 fogo',
    alcance: 'Corpo a corpo',
    descricaoAlma: 'Uma pequena fênix adormecida.',
    poderPrincipal: 'Acende por 3 rodadas.',
    instabilidadesRiscos: 'Solta faíscas inquietas.',
    efeitosPassivos: 'Sempre morna ao toque.',
    historico: 'Forjada durante uma vigília de inverno.',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should validate and create a character sheet', async () => {
      characterSheetModel.create.mockResolvedValue({
        _id: objectId,
        ...validCharacterSheet,
      });

      await expect(service.create(validCharacterSheet)).resolves.toEqual({
        _id: objectId,
        ...validCharacterSheet,
      });
      expect(characterSheetModel.create).toHaveBeenCalledWith(
        validCharacterSheet,
      );
    });

    it('should reject invalid character sheet payloads', async () => {
      await expect(
        service.create({ ...validCharacterSheet, tamanho: undefined } as never),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('magic item CRUD', () => {
    it('should validate and create a magic item sheet', async () => {
      magicItemSheetModel.create.mockResolvedValue({
        _id: objectId,
        ...validMagicItemSheet,
      });

      await expect(
        service.createMagicItem(validMagicItemSheet),
      ).resolves.toEqual({
        _id: objectId,
        ...validMagicItemSheet,
      });
      expect(magicItemSheetModel.create).toHaveBeenCalledWith(
        validMagicItemSheet,
      );
    });

    it('should reject invalid magic item payloads', async () => {
      await expect(
        service.createMagicItem({ ...validMagicItemSheet, nome: '' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should list all magic item sheets', async () => {
      magicItemSheetModel.find.mockReturnValue(
        leanResult([validMagicItemSheet]),
      );

      await expect(service.findAllMagicItems()).resolves.toEqual([
        validMagicItemSheet,
      ]);
    });

    it('should find a magic item by id', async () => {
      magicItemSheetModel.findById.mockReturnValue(
        leanResult(validMagicItemSheet),
      );

      await expect(service.findMagicItemById(objectId)).resolves.toEqual(
        validMagicItemSheet,
      );
    });

    it('should reject invalid or missing magic item ids', async () => {
      await expect(service.findMagicItemById('invalid')).rejects.toThrow(
        BadRequestException,
      );

      magicItemSheetModel.findById.mockReturnValue(leanResult(null));
      await expect(service.findMagicItemById(objectId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update a magic item by id', async () => {
      magicItemSheetModel.findByIdAndUpdate.mockReturnValue(
        leanResult({ ...validMagicItemSheet, situacaoAtual: 'Instável' }),
      );

      await expect(
        service.updateMagicItemById(objectId, { situacaoAtual: 'Instável' }),
      ).resolves.toMatchObject({ situacaoAtual: 'Instável' });
      expect(magicItemSheetModel.findByIdAndUpdate).toHaveBeenCalledWith(
        objectId,
        { situacaoAtual: 'Instável' },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      );
    });

    it('should reject invalid magic item updates', async () => {
      await expect(
        service.updateMagicItemById('invalid', { situacaoAtual: 'Instável' }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateMagicItemById(objectId, undefined as never),
      ).rejects.toThrow(BadRequestException);
      await expect(service.updateMagicItemById(objectId, {})).rejects.toThrow(
        BadRequestException,
      );

      magicItemSheetModel.findByIdAndUpdate.mockReturnValue(leanResult(null));
      await expect(
        service.updateMagicItemById(objectId, { situacaoAtual: 'Instável' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should remove a magic item and detach it from characters', async () => {
      magicItemSheetModel.findByIdAndDelete.mockReturnValue(
        leanResult(validMagicItemSheet),
      );
      characterSheetModel.updateMany.mockResolvedValue({ modifiedCount: 1 });

      await expect(service.removeMagicItemById(objectId)).resolves.toEqual({
        message: 'Ficha de item mágico removida com sucesso.',
        deletedId: objectId,
      });
      expect(characterSheetModel.updateMany).toHaveBeenCalledWith(
        { 'inventario.fichaItemMagicoId': objectId },
        {
          $pull: {
            inventario: {
              fichaItemMagicoId: objectId,
            },
          },
        },
      );
    });

    it('should reject invalid or missing magic item removals', async () => {
      await expect(service.removeMagicItemById('invalid')).rejects.toThrow(
        BadRequestException,
      );

      magicItemSheetModel.findByIdAndDelete.mockReturnValue(leanResult(null));
      await expect(service.removeMagicItemById(objectId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('character magic item inventory', () => {
    it('should attach a magic item to a character sheet', async () => {
      magicItemSheetModel.findById.mockReturnValue(
        leanResult({ ...validMagicItemSheet, peso: '1,8 kg' }),
      );
      characterSheetModel.findByIdAndUpdate.mockReturnValue(
        leanResult({ ...validCharacterSheet, _id: objectId }),
      );

      await expect(
        service.attachMagicItemToCharacterSheet(objectId, secondObjectId),
      ).resolves.toMatchObject({ _id: objectId });
      expect(characterSheetModel.findByIdAndUpdate).toHaveBeenCalledWith(
        objectId,
        {
          $push: {
            inventario: {
              nome: validMagicItemSheet.nome,
              valor: null,
              peso: 1.8,
              tipo: 'item-magico',
              fichaItemMagicoId: secondObjectId,
            },
          },
        },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      );
    });

    it('should attach magic items with unknown weight as null', async () => {
      magicItemSheetModel.findById.mockReturnValue(
        leanResult({ ...validMagicItemSheet, peso: 'leve' }),
      );
      characterSheetModel.findByIdAndUpdate.mockReturnValue(
        leanResult({ ...validCharacterSheet, _id: objectId }),
      );

      await service.attachMagicItemToCharacterSheet(objectId, secondObjectId);

      const [, update] = characterSheetModel.findByIdAndUpdate.mock
        .calls[0] as [
        string,
        { $push: { inventario: { peso: number | null } } },
        object,
      ];

      expect(update.$push.inventario.peso).toBeNull();
    });

    it('should reject invalid or missing ids when attaching magic items', async () => {
      await expect(
        service.attachMagicItemToCharacterSheet('invalid', secondObjectId),
      ).rejects.toThrow(BadRequestException);

      magicItemSheetModel.findById.mockReturnValue(leanResult(null));
      await expect(
        service.attachMagicItemToCharacterSheet(objectId, secondObjectId),
      ).rejects.toThrow(NotFoundException);

      magicItemSheetModel.findById.mockReturnValue(
        leanResult(validMagicItemSheet),
      );
      characterSheetModel.findByIdAndUpdate.mockReturnValue(leanResult(null));
      await expect(
        service.attachMagicItemToCharacterSheet(objectId, secondObjectId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should detach a magic item from a character sheet', async () => {
      characterSheetModel.findByIdAndUpdate.mockReturnValue(
        leanResult(validCharacterSheet),
      );

      await expect(
        service.detachMagicItemFromCharacterSheet(objectId, secondObjectId),
      ).resolves.toEqual(validCharacterSheet);
    });

    it('should reject invalid or missing ids when detaching magic items', async () => {
      await expect(
        service.detachMagicItemFromCharacterSheet('invalid', secondObjectId),
      ).rejects.toThrow(BadRequestException);

      characterSheetModel.findByIdAndUpdate.mockReturnValue(leanResult(null));
      await expect(
        service.detachMagicItemFromCharacterSheet(objectId, secondObjectId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('text parsing helpers', () => {
    it('should parse character and magic item sheets from text', () => {
      characterSheetParser.parse.mockReturnValue(validCharacterSheet);
      magicItemSheetParser.parse.mockReturnValue(validMagicItemSheet);

      expect(service.parseCharacterSheetFromText('character')).toBe(
        validCharacterSheet,
      );
      expect(service.parseMagicItemSheetFromText('magic')).toBe(
        validMagicItemSheet,
      );
    });

    it('should create blank T13 sheets', () => {
      expect(service.createNewT13CharacterSheet()).toMatchObject({
        sistema: 't13',
      });
      expect(service.createNewT13MagicItemSheet()).toMatchObject({
        nivelSintonia: 0,
      });
    });
  });

  describe('file extraction and parsing', () => {
    it('should extract text from a PDF', async () => {
      pdfTextExtractorService.extractText.mockResolvedValue('texto do pdf');

      await expect(
        service.extractTextFromFile(Buffer.from('pdf'), 'application/pdf'),
      ).resolves.toBe('texto do pdf');
    });

    it('should extract text from an image', async () => {
      pdfOcrService.extractFromImage.mockResolvedValue('texto da imagem');

      await expect(
        service.extractTextFromFile(Buffer.from('image'), 'image/png'),
      ).resolves.toBe('texto da imagem');
    });

    it('should reject empty files and files without extracted text', async () => {
      await expect(
        service.extractTextFromFile(Buffer.alloc(0), 'application/pdf'),
      ).rejects.toThrow(BadRequestException);

      pdfTextExtractorService.extractText.mockResolvedValue('   ');
      await expect(
        service.extractTextFromFile(Buffer.from('pdf'), 'application/pdf'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should preserve bad request errors and wrap unexpected extraction errors', async () => {
      pdfTextExtractorService.extractText.mockRejectedValue(
        new BadRequestException('pdf inválido'),
      );
      await expect(
        service.extractTextFromFile(Buffer.from('pdf'), 'application/pdf'),
      ).rejects.toThrow('pdf inválido');

      pdfTextExtractorService.extractText.mockRejectedValue(new Error('boom'));
      await expect(
        service.extractTextFromFile(Buffer.from('pdf'), 'application/pdf'),
      ).rejects.toThrow('Não foi possível processar o arquivo enviado.');
    });

    it('should preview, parse and save character sheets from files', async () => {
      pdfTextExtractorService.extractText.mockResolvedValue(
        'Ficha de Personagem',
      );
      characterSheetParser.parse.mockReturnValue(validCharacterSheet);
      characterSheetModel.create.mockResolvedValue({
        _id: objectId,
        ...validCharacterSheet,
      });

      await expect(
        service.previewCharacterSheetFromFile(
          Buffer.from('pdf'),
          'application/pdf',
        ),
      ).resolves.toEqual({
        extractedText: 'Ficha de Personagem',
        parsedSheet: validCharacterSheet,
      });
      await expect(
        service.parseCharacterSheetFromFile(
          Buffer.from('pdf'),
          'application/pdf',
        ),
      ).resolves.toEqual(validCharacterSheet);
      await expect(
        service.parseAndSaveCharacterSheetFromFile(
          Buffer.from('pdf'),
          'application/pdf',
        ),
      ).resolves.toMatchObject({ _id: objectId });
    });

    it('should preview, parse and save magic item sheets from files', async () => {
      pdfTextExtractorService.extractText.mockResolvedValue(
        'Ficha de Item Mágico',
      );
      magicItemSheetParser.parse.mockReturnValue(validMagicItemSheet);
      magicItemSheetModel.create.mockResolvedValue({
        _id: objectId,
        ...validMagicItemSheet,
      });

      await expect(
        service.previewMagicItemSheetFromFile(
          Buffer.from('pdf'),
          'application/pdf',
        ),
      ).resolves.toEqual({
        extractedText: 'Ficha de Item Mágico',
        parsedSheet: validMagicItemSheet,
      });
      await expect(
        service.parseMagicItemSheetFromFile(
          Buffer.from('pdf'),
          'application/pdf',
        ),
      ).resolves.toEqual(validMagicItemSheet);
      await expect(
        service.parseAndSaveMagicItemSheetFromFile(
          Buffer.from('pdf'),
          'application/pdf',
        ),
      ).resolves.toMatchObject({ _id: objectId });
    });
  });

  describe('character sheet CRUD and PDF rendering', () => {
    it('should list all character sheets', async () => {
      jest.spyOn(console, 'log').mockImplementation(() => undefined);
      characterSheetModel.find.mockReturnValue(
        leanResult([validCharacterSheet]),
      );

      await expect(service.findAll()).resolves.toEqual([validCharacterSheet]);
    });

    it('should find a character sheet by id', async () => {
      characterSheetModel.findById.mockReturnValue(
        leanResult(validCharacterSheet),
      );

      await expect(service.findById(objectId)).resolves.toEqual(
        validCharacterSheet,
      );
    });

    it('should reject invalid or missing character sheet ids', async () => {
      await expect(service.findById('invalid')).rejects.toThrow(
        BadRequestException,
      );

      characterSheetModel.findById.mockReturnValue(leanResult(null));
      await expect(service.findById(objectId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should generate character sheet html and pdf', async () => {
      characterSheetModel.findById.mockReturnValue(
        leanResult(validCharacterSheet),
      );
      characterSheetHtmlService.createCharacterSheetHtml.mockReturnValue(
        '<html></html>',
      );
      htmlPdfRendererService.render.mockResolvedValue(Buffer.from('pdf'));

      await expect(
        service.generateCharacterSheetHtmlById(objectId),
      ).resolves.toBe('<html></html>');
      await expect(service.generateCharacterPdfById(objectId)).resolves.toEqual(
        Buffer.from('pdf'),
      );
      expect(htmlPdfRendererService.render).toHaveBeenCalledWith(
        '<html></html>',
        {
          format: 'A4',
          printBackground: true,
        },
      );
    });

    it('should remove a character sheet by id', async () => {
      characterSheetModel.findByIdAndDelete.mockReturnValue(
        leanResult(validCharacterSheet),
      );

      await expect(service.removeById(objectId)).resolves.toEqual({
        message: 'Ficha removida com sucesso.',
        deletedId: objectId,
      });
    });

    it('should reject invalid or missing character sheet removals', async () => {
      await expect(service.removeById('invalid')).rejects.toThrow(
        BadRequestException,
      );

      characterSheetModel.findByIdAndDelete.mockReturnValue(leanResult(null));
      await expect(service.removeById(objectId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update a character sheet by id', async () => {
      characterSheetModel.findByIdAndUpdate.mockReturnValue(
        leanResult({ ...validCharacterSheet, nome: 'Novo nome' }),
      );

      await expect(
        service.updateById(objectId, { nome: 'Novo nome' }),
      ).resolves.toMatchObject({ nome: 'Novo nome' });
      expect(characterSheetModel.findByIdAndUpdate).toHaveBeenCalledWith(
        objectId,
        { nome: 'Novo nome' },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      );
    });

    it('should reject invalid character sheet updates', async () => {
      await expect(
        service.updateById('invalid', { nome: 'Novo nome' }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateById(objectId, undefined as never),
      ).rejects.toThrow(BadRequestException);
      await expect(service.updateById(objectId, {})).rejects.toThrow(
        BadRequestException,
      );

      characterSheetModel.findByIdAndUpdate.mockReturnValue(leanResult(null));
      await expect(
        service.updateById(objectId, { nome: 'Novo nome' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
