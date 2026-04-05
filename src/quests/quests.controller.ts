import { Body, BadRequestException, Controller, Get, Post } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { selectQuestSchema, SelectQuestDto } from './dto/select-quest.dto';

// Define o caminho base das rotas desse controller
// Tudo aqui dentro começa com /quests
@Controller('quests')
export class QuestsController {
  constructor(private readonly questService: QuestsService) {}

  // Cria uma rota POST com caminho "select"
  // Resultado final: POST /quests/select
  @Post('select')
  selectQuest(@Body() body: unknown) {
    const result = selectQuestSchema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException(result.error.issues);
    }

    const validBody = result.data as SelectQuestDto;
    const selectQuest = this.questService.fintQuestById(validBody.questId);

    if (this.questService.hasActiveQuest()) {
      return { message: 'você já possui uma quest ativa' };
    }

    if (!selectQuest) {
      return { message: 'quest não encontrada' };
    }

    this.questService.setActiveQuest(selectQuest);

    return {
      message: 'quest recebida',
      quest: selectQuest,
    };
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
        if (!this.questService.hasActiveQuest()){
            return {
                message: 'não existe quest ativa para concluir',
            };
        }

        this.questService.completeActiveQuest();
        
        return {
            message: 'quest concluída',
        }
    }

}