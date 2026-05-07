import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { formatZodValidationError } from '../../common/errors/zod-validation-error';
import { CharacterSheetParser } from '../parsers/character-sheets/character-sheet.parser';
import {
  CharacterSheet as CharacterSheetModel,
  CharacterSheetDocument,
} from '../schemas/character-sheet.mongo';
import {
  MagicItemSheet,
  MagicItemSheetDocument,
} from '../schemas/magic-item-sheet.mongo';
import { PdfTextExtractorService } from './pdf-text-extractor.service';
import {
  characterSheetSchema,
  updateCharacterSheetSchema,
  type CharacterSheet,
  type UpdateCharacterSheet,
} from '../schemas/character-sheet.schema';
import { PdfOcrService } from './pdf-ocr.service';
import { MagicItemSheetParser } from '../parsers/magic-item-sheets/magic-item-sheet.parser';
import { createNewT13CharacterSheet } from '../pdf-document-service/systems/T13/templates/new-sheet.template';
import { createNewT13MagicItemSheet } from '../pdf-document-service/systems/T13/templates/new-magic-item-sheet.template';
import {
  magicItemSheetSchema,
  type MagicItemSheet as MagicItemSheetData,
  updateMagicItemSheetSchema,
  type UpdateMagicItemSheet,
} from '../schemas/magic-item-sheet.schema';
import { CharacterSheetHtmlService } from '../pdf-document-service/services/character-sheet-html.service';
import { HtmlPdfRendererService } from '../pdf-document-service/services/html-pdf-renderer.service';

/* istanbul ignore next */
@Injectable()
export class SheetsService {
  private readonly characterSheetModel: Model<CharacterSheetDocument>;
  private readonly magicItemSheetModel: Model<MagicItemSheetDocument>;
  private readonly characterSheetParser: CharacterSheetParser;
  private readonly magicItemSheetParser: MagicItemSheetParser;
  private readonly pdfTextExtractorService: PdfTextExtractorService;
  private readonly pdfOcrService: PdfOcrService;
  private readonly characterSheetHtmlService: CharacterSheetHtmlService;
  private readonly htmlPdfRendererService: HtmlPdfRendererService;

  constructor(
    @InjectModel(CharacterSheetModel.name)
    characterSheetModel: Model<CharacterSheetDocument>,
    @InjectModel(MagicItemSheet.name)
    magicItemSheetModel: Model<MagicItemSheetDocument>,
    characterSheetParser: CharacterSheetParser,
    magicItemSheetParser: MagicItemSheetParser,
    pdfTextExtractorService: PdfTextExtractorService,
    pdfOcrService: PdfOcrService,
    characterSheetHtmlService: CharacterSheetHtmlService,
    htmlPdfRendererService: HtmlPdfRendererService,
  ) {
    this.characterSheetModel = characterSheetModel;
    this.magicItemSheetModel = magicItemSheetModel;
    this.characterSheetParser = characterSheetParser;
    this.magicItemSheetParser = magicItemSheetParser;
    this.pdfTextExtractorService = pdfTextExtractorService;
    this.pdfOcrService = pdfOcrService;
    this.characterSheetHtmlService = characterSheetHtmlService;
    this.htmlPdfRendererService = htmlPdfRendererService;
  }

  async create(payload: CharacterSheet) {
    const result = characterSheetSchema.safeParse(payload);

    if (!result.success) {
      throw new BadRequestException(formatZodValidationError(result.error));
    }

    return this.characterSheetModel.create(result.data);
  }

  async createMagicItem(payload: MagicItemSheetData) {
    const result = magicItemSheetSchema.safeParse(payload);

    if (!result.success) {
      throw new BadRequestException(formatZodValidationError(result.error));
    }

    return this.magicItemSheetModel.create(result.data);
  }

  async findAllMagicItems() {
    return this.magicItemSheetModel.find().lean();
  }

  async findMagicItemById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID inválido.');
    }

    const magicItem = await this.magicItemSheetModel.findById(id).lean();

    if (!magicItem) {
      throw new NotFoundException('Ficha de item mágico não encontrada.');
    }

    return magicItem;
  }

  async updateMagicItemById(id: string, payload: UpdateMagicItemSheet) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID inválido.');
    }

    if (!payload) {
      throw new BadRequestException('Body da requisição é obrigatório.');
    }

    const result = updateMagicItemSheetSchema.safeParse(payload);

    if (!result.success) {
      throw new BadRequestException(formatZodValidationError(result.error));
    }

    const updatedMagicItem = await this.magicItemSheetModel
      .findByIdAndUpdate(id, result.data, {
        returnDocument: 'after',
        runValidators: true,
      })
      .lean();

    if (!updatedMagicItem) {
      throw new NotFoundException('Ficha de item mágico não encontrada.');
    }

    return updatedMagicItem;
  }

  async removeMagicItemById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID inválido.');
    }

    const deletedMagicItem = await this.magicItemSheetModel
      .findByIdAndDelete(id)
      .lean();

    if (!deletedMagicItem) {
      throw new NotFoundException('Ficha de item mágico não encontrada.');
    }

    await this.characterSheetModel.updateMany(
      { 'inventario.fichaItemMagicoId': id },
      {
        $pull: {
          inventario: {
            fichaItemMagicoId: id,
          },
        },
      },
    );

    return {
      message: 'Ficha de item mágico removida com sucesso.',
      deletedId: id,
    };
  }

  async attachMagicItemToCharacterSheet(id: string, magicItemId: string) {
    if (!isValidObjectId(id) || !isValidObjectId(magicItemId)) {
      throw new BadRequestException('ID inválido.');
    }

    const magicItem = await this.magicItemSheetModel
      .findById(magicItemId)
      .lean();

    if (!magicItem) {
      throw new NotFoundException('Ficha de item mágico não encontrada.');
    }

    const updatedSheet = await this.characterSheetModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            inventario: {
              nome: magicItem.nome,
              valor: null,
              peso: this.parseWeightInKg(magicItem.peso),
              tipo: 'item-magico',
              fichaItemMagicoId: magicItemId,
            },
          },
        },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      )
      .lean();

    if (!updatedSheet) {
      throw new NotFoundException('Ficha não encontrada.');
    }

    return updatedSheet;
  }

  async detachMagicItemFromCharacterSheet(id: string, magicItemId: string) {
    if (!isValidObjectId(id) || !isValidObjectId(magicItemId)) {
      throw new BadRequestException('ID inválido.');
    }

    const updatedSheet = await this.characterSheetModel
      .findByIdAndUpdate(
        id,
        {
          $pull: {
            inventario: {
              fichaItemMagicoId: magicItemId,
            },
          },
        },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      )
      .lean();

    if (!updatedSheet) {
      throw new NotFoundException('Ficha não encontrada.');
    }

    return updatedSheet;
  }

  parseCharacterSheetFromText(text: string) {
    return this.characterSheetParser.parse(text);
  }

  createNewT13CharacterSheet(): CharacterSheet {
    return createNewT13CharacterSheet();
  }

  createNewT13MagicItemSheet(): MagicItemSheetData {
    return createNewT13MagicItemSheet();
  }

  parseMagicItemSheetFromText(text: string) {
    return this.magicItemSheetParser.parse(text);
  }

  async extractTextFromFile(buffer: Buffer, mimetype: string) {
    if (!buffer.length) {
      throw new BadRequestException('O arquivo enviado está vazio.');
    }

    let extractedText = '';

    try {
      if (mimetype === 'application/pdf') {
        extractedText = await this.pdfTextExtractorService.extractText(buffer);
      }

      if (mimetype.startsWith('image/')) {
        extractedText = await this.pdfOcrService.extractFromImage(buffer);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Não foi possível processar o arquivo enviado.',
      );
    }

    if (!extractedText.trim()) {
      throw new BadRequestException(
        'Não foi possível extrair texto do arquivo enviado.',
      );
    }

    return extractedText;
  }

  async previewCharacterSheetFromFile(buffer: Buffer, mimetype: string) {
    const extractedText = await this.extractTextFromFile(buffer, mimetype);

    return {
      extractedText,
      parsedSheet: this.characterSheetParser.parse(extractedText),
    };
  }

  async previewMagicItemSheetFromFile(buffer: Buffer, mimetype: string) {
    const extractedText = await this.extractTextFromFile(buffer, mimetype);

    return {
      extractedText,
      parsedSheet: this.magicItemSheetParser.parse(extractedText),
    };
  }

  async parseCharacterSheetFromFile(buffer: Buffer, mimetype: string) {
    const extractedText = await this.extractTextFromFile(buffer, mimetype);

    return this.characterSheetParser.parse(extractedText);
  }

  async parseMagicItemSheetFromFile(buffer: Buffer, mimetype: string) {
    const extractedText = await this.extractTextFromFile(buffer, mimetype);

    return this.magicItemSheetParser.parse(extractedText);
  }

  async parseAndSaveCharacterSheetFromFile(buffer: Buffer, mimetype: string) {
    const parsedSheet = await this.parseCharacterSheetFromFile(
      buffer,
      mimetype,
    );

    const createdSheet = await this.characterSheetModel.create(parsedSheet);

    return createdSheet;
  }

  async parseAndSaveMagicItemSheetFromFile(buffer: Buffer, mimetype: string) {
    const parsedSheet = await this.parseMagicItemSheetFromFile(
      buffer,
      mimetype,
    );

    const createdSheet = await this.magicItemSheetModel.create(parsedSheet);

    return createdSheet;
  }

  async findAll() {
    console.log('COLLECTION:', this.characterSheetModel.collection.name);
    const data = await this.characterSheetModel.find().lean();
    console.log('DATA:', data);
    return data;
  }

  async findById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID inválido.');
    }

    const sheet = await this.characterSheetModel.findById(id).lean();

    if (!sheet) {
      throw new NotFoundException('Ficha não encontrada.');
    }

    return sheet;
  }

  async generateCharacterPdfById(id: string) {
    return this.generateCharacterPdfFromHtmlById(id);
  }

  async generateCharacterSheetHtmlById(id: string) {
    const sheet = await this.findById(id);

    return this.characterSheetHtmlService.createCharacterSheetHtml(
      sheet as CharacterSheet,
    );
  }

  async generateCharacterPdfFromHtmlById(id: string) {
    const html = await this.generateCharacterSheetHtmlById(id);

    return this.htmlPdfRendererService.render(html, {
      format: 'A4',
      printBackground: true,
    });
  }

  async removeById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID inválido.');
    }

    const deletedSheet = await this.characterSheetModel
      .findByIdAndDelete(id)
      .lean();

    if (!deletedSheet) {
      throw new NotFoundException('Ficha não encontrada.');
    }

    return {
      message: 'Ficha removida com sucesso.',
      deletedId: id,
    };
  }

  async updateById(id: string, payload: UpdateCharacterSheet) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID inválido.');
    }

    if (!payload) {
      throw new BadRequestException('Body da requisição é obrigatório.');
    }

    const result = updateCharacterSheetSchema.safeParse(payload);

    if (!result.success) {
      throw new BadRequestException(formatZodValidationError(result.error));
    }

    const updatedSheet = await this.characterSheetModel
      .findByIdAndUpdate(id, result.data, {
        returnDocument: 'after',
        runValidators: true,
      })
      .lean();

    if (!updatedSheet) {
      throw new NotFoundException('Ficha não encontrada.');
    }

    return updatedSheet;
  }

  private parseWeightInKg(value: string): number | null {
    const match = value.match(/(\d+(?:[,.]\d+)?)/);

    if (!match) {
      return null;
    }

    const parsedWeight = Number(match[1].replace(',', '.'));

    return parsedWeight;
  }
}
