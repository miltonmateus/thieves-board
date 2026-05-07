import { rollDiceSchema } from './roll-dice.schema';

describe('rollDiceSchema', () => {
  it('should default quantity to one', () => {
    expect(rollDiceSchema.parse({ diceId: 'd6' })).toEqual({
      diceId: 'd6',
      quantity: 1,
    });
  });

  it('should accept quantities from one to ten', () => {
    expect(
      rollDiceSchema.safeParse({ diceId: 'd6', quantity: 1 }).success,
    ).toBe(true);
    expect(
      rollDiceSchema.safeParse({ diceId: 'd6', quantity: 10 }).success,
    ).toBe(true);
  });

  it('should reject empty dice ids and invalid quantities', () => {
    expect(rollDiceSchema.safeParse({ diceId: '', quantity: 1 }).success).toBe(
      false,
    );
    expect(
      rollDiceSchema.safeParse({ diceId: 'd6', quantity: 0 }).success,
    ).toBe(false);
    expect(
      rollDiceSchema.safeParse({ diceId: 'd6', quantity: 11 }).success,
    ).toBe(false);
    expect(
      rollDiceSchema.safeParse({ diceId: 'd6', quantity: 1.5 }).success,
    ).toBe(false);
  });
});
