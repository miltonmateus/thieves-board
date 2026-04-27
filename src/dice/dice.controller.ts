import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { DiceService } from './dice.service';
import { rollDiceSchema } from './schemas/roll-dice.schema';

@Controller('dice')
export class DiceController {
  constructor(private readonly diceService: DiceService) {}

  @Get()
  getAvailableDice() {
    return this.diceService.getAvailableDice();
  }

  @Post('roll')
  rollDice(@Body() body: unknown) {
    const parsedBody = rollDiceSchema.safeParse(body);

    if (!parsedBody.success) {
      throw new BadRequestException({
        message: 'Dados inválidos para rolagem',
        errors: parsedBody.error.flatten().fieldErrors,
      });
    }

    return this.diceService.rollDice(parsedBody.data);
  }
}
