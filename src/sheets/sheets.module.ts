import { Module } from '@nestjs/common';
import { SheetsController } from './sheets.controller';
import { SheetsService } from './services/sheets.service';
import { CharacterSheetParser } from './parsers/character-sheets/character-sheet.parser';
import { T13CharacterSheetParser } from './parsers/character-sheets/t13-character-sheet.parser';
import { CharacterSheetTypeDetector } from './detectors/character-sheets/character-sheet-type.detector';
import { PdfTextExtractorService } from './services/pdf-text-extractor.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CharacterSheet,
  CharacterSheetSchema,
} from './schemas/character-sheet.mongo';
import { PdfImageConverterService } from './services/pdf-image-converter.service';
import { PdfOcrService } from './services/pdf-ocr.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CharacterSheet.name, schema: CharacterSheetSchema },
    ]),
  ],
  controllers: [SheetsController],
  providers: [
    SheetsService,
    CharacterSheetParser,
    T13CharacterSheetParser,
    CharacterSheetTypeDetector,
    PdfTextExtractorService,
    PdfOcrService,
    PdfImageConverterService,
  ],
})
export class SheetsModule {}
