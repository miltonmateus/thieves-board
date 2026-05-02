import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { formatZodValidationError } from '../common/errors/zod-validation-error';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { mongoObjectIdSchema } from '../common/schemas/mongo-object-id.schema';
import { SheetsService } from './services/sheets.service';
import {
  characterSheetSchema,
  updateCharacterSheetSchema,
  type CharacterSheet,
  type UpdateCharacterSheet,
} from './schemas/character-sheet.schema';
import {
  magicItemSheetSchema,
  type MagicItemSheet,
  updateMagicItemSheetSchema,
  type UpdateMagicItemSheet,
} from './schemas/magic-item-sheet.schema';
import { uploadedSheetFileSchema } from './schemas/uploaded-sheet-file.schema';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Get('test-character')
  testCharacter() {
    const fakeText = `
      Ficha de Personagem
      Nome: Milton Jogador: João
      Data de Criação: 10/04/2026 PP: 10 PP p/ gastar: 5
      Aparência: Alto Cenário: Eldoria
      História: Um herói qualquer Tamanho: 2 x 3 Altura: 180 Peso: 80
      CM: 10

      Inventário
      Espada
      Escudo

      MARCAS PESSOAIS
      Cicatriz

      Anotações:
      Teste
      `;

    return this.sheetsService.parseCharacterSheetFromText(fakeText);
  }

  @Post('upload-character-file')
  async uploadCharacterFile(@Req() request: FastifyRequest) {
    const { buffer, mimetype } = await this.readSupportedFile(request);

    return this.sheetsService.parseAndSaveCharacterSheetFromFile(
      buffer,
      mimetype,
    );
  }

  @Post('upload-character-pdf')
  async uploadCharacterPdf(@Req() request: FastifyRequest) {
    return this.uploadCharacterFile(request);
  }

  @Post('preview-character-file')
  async previewCharacterFile(@Req() request: FastifyRequest) {
    const { buffer, mimetype } = await this.readSupportedFile(request);

    return this.sheetsService.previewCharacterSheetFromFile(buffer, mimetype);
  }

  @Post('preview-magic-item-file')
  async previewMagicItemFile(@Req() request: FastifyRequest) {
    const { buffer, mimetype } = await this.readSupportedFile(request);

    return this.sheetsService.previewMagicItemSheetFromFile(buffer, mimetype);
  }

  @Post('upload-magic-item-file')
  async uploadMagicItemFile(@Req() request: FastifyRequest) {
    const { buffer, mimetype } = await this.readSupportedFile(request);

    return this.sheetsService.parseAndSaveMagicItemSheetFromFile(
      buffer,
      mimetype,
    );
  }

  @Post('magic-items')
  async createMagicItem(
    @Body(new ZodValidationPipe(magicItemSheetSchema))
    body: MagicItemSheet,
  ) {
    return this.sheetsService.createMagicItem(body);
  }

  @Get('magic-items')
  async findAllMagicItems() {
    return this.sheetsService.findAllMagicItems();
  }

  @Get('magic-items/:id')
  async findMagicItemById(
    @Param('id', new ZodValidationPipe(mongoObjectIdSchema)) id: string,
  ) {
    return this.sheetsService.findMagicItemById(id);
  }

  @Patch('magic-items/:id')
  async updateMagicItemById(
    @Param('id', new ZodValidationPipe(mongoObjectIdSchema)) id: string,
    @Body(new ZodValidationPipe(updateMagicItemSheetSchema))
    body: UpdateMagicItemSheet,
  ) {
    return this.sheetsService.updateMagicItemById(id, body);
  }

  @Delete('magic-items/:id')
  async removeMagicItemById(
    @Param('id', new ZodValidationPipe(mongoObjectIdSchema)) id: string,
  ) {
    return this.sheetsService.removeMagicItemById(id);
  }

  @Post(':id/inventory/magic-items/:magicItemId')
  async attachMagicItemToCharacterSheet(
    @Param('id', new ZodValidationPipe(mongoObjectIdSchema)) id: string,
    @Param('magicItemId', new ZodValidationPipe(mongoObjectIdSchema))
    magicItemId: string,
  ) {
    return this.sheetsService.attachMagicItemToCharacterSheet(id, magicItemId);
  }

  @Delete(':id/inventory/magic-items/:magicItemId')
  async detachMagicItemFromCharacterSheet(
    @Param('id', new ZodValidationPipe(mongoObjectIdSchema)) id: string,
    @Param('magicItemId', new ZodValidationPipe(mongoObjectIdSchema))
    magicItemId: string,
  ) {
    return this.sheetsService.detachMagicItemFromCharacterSheet(
      id,
      magicItemId,
    );
  }

  @Get('templates/t13/new-sheet')
  createNewT13CharacterSheet() {
    return this.sheetsService.createNewT13CharacterSheet();
  }

  @Get('templates/t13/new-magic-item-sheet')
  createNewT13MagicItemSheet() {
    return this.sheetsService.createNewT13MagicItemSheet();
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(characterSheetSchema))
    body: CharacterSheet,
  ) {
    return this.sheetsService.create(body);
  }

  @Get()
  async findAll() {
    return this.sheetsService.findAll();
  }

  @Get(':id/pdf')
  async exportCharacterPdf(
    @Param('id', new ZodValidationPipe(mongoObjectIdSchema)) id: string,
    @Res() reply: FastifyReply,
  ) {
    const pdfBuffer = await this.sheetsService.generateCharacterPdfById(id);

    return reply
      .header('Content-Type', 'application/pdf')
      .header(
        'Content-Disposition',
        `attachment; filename="character-${id}.pdf"`,
      )
      .send(pdfBuffer);
  }

  @Get(':id/html')
  async previewCharacterHtml(
    @Param('id', new ZodValidationPipe(mongoObjectIdSchema)) id: string,
    @Res() reply: FastifyReply,
  ) {
    const html = await this.sheetsService.generateCharacterSheetHtmlById(id);

    return reply.header('Content-Type', 'text/html; charset=utf-8').send(html);
  }

  @Get(':id')
  async findById(
    @Param('id', new ZodValidationPipe(mongoObjectIdSchema)) id: string,
  ) {
    return this.sheetsService.findById(id);
  }

  @Delete(':id')
  async removeById(
    @Param('id', new ZodValidationPipe(mongoObjectIdSchema)) id: string,
  ) {
    return this.sheetsService.removeById(id);
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
  }

  private async readSupportedFile(request: FastifyRequest) {
    const file = await request.file();

    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    const parsedFile = uploadedSheetFileSchema.safeParse({
      buffer: await this.streamToBuffer(file.file),
      filename: file.filename,
      mimetype: file.mimetype,
    });

    if (!parsedFile.success) {
      throw new BadRequestException(formatZodValidationError(parsedFile.error));
    }

    return parsedFile.data;
  }

  @Patch(':id')
  async updateById(
    @Param('id', new ZodValidationPipe(mongoObjectIdSchema)) id: string,
    @Body(new ZodValidationPipe(updateCharacterSheetSchema))
    body: UpdateCharacterSheet,
  ) {
    return this.sheetsService.updateById(id, body);
  }
}
