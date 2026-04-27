import { Injectable, NotFoundException } from '@nestjs/common';
import { diceCatalog, findDiceById } from './data/dice.catalog';
import type { RollDiceSchema } from './schemas/roll-dice.schema';

@Injectable()
export class DiceService {
  getAvailableDice() {
    return diceCatalog.map((dice) => ({
      id: dice.id,
      label: dice.label,
      type: dice.type,
      canSum: dice.canSum,
      sides: dice.faces.length,
    }));
  }

  rollDice({ diceId, quantity }: RollDiceSchema) {
    const dice = findDiceById(diceId);

    if (!dice) {
      throw new NotFoundException(`Dado com id "  ${diceId}  " nao encontrado`);
    }

    const rolls = Array.from({ length: quantity ?? 1 }, () => {
      const randomIndex = Math.floor(Math.random() * dice.faces.length);
      return dice.faces[randomIndex];
    });

    const response = {
      diceId: dice.id,
      label: dice.label,
      type: dice.type,
      quantity,
      rolls,
    };

    if (dice.canSum) {
      const total = rolls.reduce((sum, face) => {
        if (typeof face.value === 'number') {
          return sum + face.value;
        }

        return sum;
      }, 0);

      return {
        ...response,
        total,
      };
    }

    return response;
  }
}
