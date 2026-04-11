import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestsController } from './quests/quests.controller';
import { QuestsService } from './quests/quests.service';
import { DiceModule } from './dice/dice.module';
import { SheetsModule } from './sheets/sheets.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    DiceModule,
    SheetsModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/thieves-board'),
  ],
  controllers: [AppController, QuestsController],
  providers: [AppService, QuestsService],
})
export class AppModule {}
