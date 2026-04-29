import { Body, Controller, Get, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { DiceService } from './dice.service';
import {
  rollDiceSchema,
  type RollDiceSchema,
} from './schemas/roll-dice.schema';

@Controller('dice')
export class DiceController {
  constructor(private readonly diceService: DiceService) {}

  @Get()
  getAvailableDice() {
    return this.diceService.getAvailableDice();
  }

  @Post('roll')
  rollDice(@Body(new ZodValidationPipe(rollDiceSchema)) body: RollDiceSchema) {
    return this.diceService.rollDice(body);
  }
}
