import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiceModule } from './dice/dice.module';
import { SheetsModule } from './sheets/sheets.module';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestsModule } from './quests/quests.module';

@Module({
  imports: [
    DiceModule,
    SheetsModule,
    QuestsModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/thieves-board'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
