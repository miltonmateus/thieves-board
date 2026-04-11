import { Module } from '@nestjs/common';
import { SheetsController } from './sheets.controller';
import { SheetsService } from './services/sheets.service';
import { CharacterSheetParser } from './parsers/character-sheet.parser';
import { PdfTextExtractorService } from './services/pdf-text-extractor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterSheet, CharacterSheetSchema } from './schemas/character-sheet.mongo';

@Module({
    imports: [MongooseModule.forFeature([
      { name: CharacterSheet.name, schema: CharacterSheetSchema}
    ])
  ],
  controllers: [SheetsController],
  providers: [SheetsService, CharacterSheetParser, PdfTextExtractorService],
})
export class SheetsModule {}