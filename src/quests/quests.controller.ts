import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { selectQuestSchema } from './select-quest.schema';
import type { SelectQuestInput } from './select-quest.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

// Define o caminho base das rotas desse controller
// Tudo aqui dentro começa com /quests
@Controller('quests')
export class QuestsController {
  constructor(private readonly questService: QuestsService) {}

  // Cria uma rota POST com caminho "select"
  // Resultado final: POST /quests/select
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
    };

    @Post('complete')
    completeQuest() {
    return this.questService.completeQuest();
    }
}