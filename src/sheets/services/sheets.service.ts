import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CharacterSheetParser } from '../parsers/character-sheet.parser';
import {
  CharacterSheet,
  CharacterSheetDocument,
} from '../schemas/character-sheet.mongo';
import { PdfTextExtractorService } from './pdf-text-extractor.service';
import {
  updateCharacterSheetSchema,
  type UpdateCharacterSheet,
} from '../schemas/character-sheet.schema';
import { PdfOcrService } from './pdf-ocr.service';

@Injectable()
export class SheetsService {
  constructor(
    @InjectModel(CharacterSheet.name)
    private readonly characterSheetModel: Model<CharacterSheetDocument>,
    private readonly characterSheetParser: CharacterSheetParser,
    private readonly pdfTextExtractorService: PdfTextExtractorService,
    private readonly pdfOcrService: PdfOcrService,
  ) {}

  parseCharacterSheetFromText(text: string) {
    return this.characterSheetParser.parse(text);
  }

  async extractTextFromFile(buffer: Buffer, mimetype: string) {
    if (!buffer.length) {
      throw new BadRequestException('O arquivo enviado está vazio.');
    }

    let extractedText = '';

    if (mimetype === 'application/pdf') {
      extractedText = await this.pdfTextExtractorService.extractText(buffer);
    }

    if (mimetype.startsWith('image/')) {
      extractedText = await this.pdfOcrService.extractFromImage(buffer);
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

  async parseCharacterSheetFromFile(buffer: Buffer, mimetype: string) {
    const extractedText = await this.extractTextFromFile(buffer, mimetype);

    return this.characterSheetParser.parse(extractedText);
  }

  async parseAndSaveCharacterSheetFromFile(buffer: Buffer, mimetype: string) {
    const parsedSheet = await this.parseCharacterSheetFromFile(
      buffer,
      mimetype,
    );

    const createdSheet = await this.characterSheetModel.create(parsedSheet);

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

    const validatedPayload = updateCharacterSheetSchema.parse(payload);
    const updatedSheet = await this.characterSheetModel
      .findByIdAndUpdate(id, validatedPayload, {
        returnDocument: 'after',
        runValidators: true,
      })
      .lean();

    if (!updatedSheet) {
      throw new NotFoundException('Ficha não encontrada.');
    }

    return updatedSheet;
  }
}
