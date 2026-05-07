import { diceDefinitionSchema, diceFaceSchema } from './dice-definition.schema';

describe('diceDefinitionSchema', () => {
  it('should accept numeric and symbolic dice definitions', () => {
    expect(
      diceDefinitionSchema.safeParse({
        id: 'd6',
        label: 'D6',
        type: 'numeric',
        faces: [{ value: 1 }, { value: 2, label: 'dois' }],
        canSum: true,
      }).success,
    ).toBe(true);

    expect(
      diceDefinitionSchema.safeParse({
        id: 'fate',
        label: 'Fate',
        type: 'symbolic',
        faces: [{ value: '+' }, { value: 'blank' }],
        canSum: false,
      }).success,
    ).toBe(true);
  });

  it('should reject invalid face values and dice types', () => {
    expect(diceFaceSchema.safeParse({ value: true }).success).toBe(false);
    expect(
      diceDefinitionSchema.safeParse({
        id: 'custom',
        label: 'Custom',
        type: 'custom',
        faces: [{ value: 1 }],
        canSum: true,
      }).success,
    ).toBe(false);
  });
});
