import { Body, Controller, Get, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createQuestSchema } from './schemas/create-quest.schema';
import type { CreateQuestInput } from './schemas/create-quest.schema';
import { selectQuestSchema } from './schemas/select-quest.schema';
import type { SelectQuestInput } from './schemas/select-quest.schema';
import { QuestsService } from './quests.service';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questService: QuestsService) {}

  @Post()
  createQuest(
    @Body(new ZodValidationPipe(createQuestSchema)) body: CreateQuestInput,
  ) {
    return this.questService.createQuest(body);
  }

  @Post('select')
  selectQuest(
    @Body(new ZodValidationPipe(selectQuestSchema)) body: SelectQuestInput,
  ) {
    return this.questService.selectQuest(body.questId);
  }

  @Get()
  getAllQuests() {
    return this.questService.getAllQuests();
  }

  @Get('active')
  getActiveQuest() {
    return this.questService.getActiveQuest();
  }

  @Post('complete')
  completeQuest() {
    return this.questService.completeQuest();
  }
}
