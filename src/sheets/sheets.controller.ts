import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Body,
  Patch,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { SheetsService } from './services/sheets.service';
import type { UpdateCharacterSheet } from './schemas/character-sheet.schema';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) {}

  private readonly supportedFileTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
  ];

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

  @Post('preview-character-file')
  async previewCharacterFile(@Req() request: FastifyRequest) {
    const { buffer, mimetype } = await this.readSupportedFile(request);

    return this.sheetsService.previewCharacterSheetFromFile(buffer, mimetype);
  }

  @Get()
  async findAll() {
    return this.sheetsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.sheetsService.findById(id);
  }

  @Delete(':id')
  async removeById(@Param('id') id: string) {
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

    if (!this.supportedFileTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'O arquivo enviado precisa ser um PDF, JPG ou PNG.',
      );
    }

    return {
      buffer: await this.streamToBuffer(file.file),
      filename: file.filename,
      mimetype: file.mimetype,
    };
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateCharacterSheet,
  ) {
    return this.sheetsService.updateById(id, body);
  }
}
