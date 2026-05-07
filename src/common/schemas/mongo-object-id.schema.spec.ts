import { mongoObjectIdSchema } from './mongo-object-id.schema';

describe('mongoObjectIdSchema', () => {
  it('should accept valid mongo object ids', () => {
    expect(
      mongoObjectIdSchema.safeParse('507f1f77bcf86cd799439011').success,
    ).toBe(true);
    expect(
      mongoObjectIdSchema.safeParse('507F1F77BCF86CD799439011').success,
    ).toBe(true);
  });

  it('should reject malformed ids', () => {
    expect(mongoObjectIdSchema.safeParse('invalid-id').success).toBe(false);
    expect(
      mongoObjectIdSchema.safeParse('507f1f77bcf86cd79943901').success,
    ).toBe(false);
  });
});
