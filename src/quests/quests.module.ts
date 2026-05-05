import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestsController } from './quests.controller';
import { QuestsService } from './quests.service';
import { QuestModel, QuestSchema } from './schemas/quest.mongo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: QuestModel.name, schema: QuestSchema }]),
  ],
  controllers: [QuestsController],
  providers: [QuestsService],
})
export class QuestsModule {}
