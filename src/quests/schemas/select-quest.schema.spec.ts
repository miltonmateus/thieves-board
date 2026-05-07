import { selectQuestSchema } from './select-quest.schema';

describe('selectQuestSchema', () => {
  it('should accept non-empty quest ids', () => {
    expect(selectQuestSchema.safeParse({ questId: 'quest-id' }).success).toBe(
      true,
    );
  });

  it('should reject empty quest ids', () => {
    expect(selectQuestSchema.safeParse({ questId: '' }).success).toBe(false);
  });
});
