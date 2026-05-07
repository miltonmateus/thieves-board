import { createQuestSchema } from './create-quest.schema';

describe('createQuestSchema', () => {
  it('should normalize the quest name', () => {
    expect(
      createQuestSchema.parse({
        name: '  A   Ponte    Antiga  ',
        description: 'Investigar a ponte.',
      }),
    ).toEqual({
      name: 'A Ponte Antiga',
      description: 'Investigar a ponte.',
    });
  });

  it('should reject empty fields and unknown keys', () => {
    expect(
      createQuestSchema.safeParse({
        name: '',
        description: 'Investigar a ponte.',
      }).success,
    ).toBe(false);
    expect(
      createQuestSchema.safeParse({
        name: 'A Ponte Antiga',
        description: '   ',
      }).success,
    ).toBe(false);
    expect(
      createQuestSchema.safeParse({
        name: 'A Ponte Antiga',
        description: 'Investigar a ponte.',
        extra: true,
      }).success,
    ).toBe(false);
  });
});
