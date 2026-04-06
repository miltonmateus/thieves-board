import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestsController } from './quests/quests.controller';
import { QuestsService } from './quests/quests.service';
import { DiceModule } from './dice/dice.module';

@Module({
  imports: [DiceModule],
  controllers: [AppController, QuestsController],
  providers: [AppService, QuestsService],
})
export class AppModule {}
