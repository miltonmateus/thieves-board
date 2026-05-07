import { z } from 'zod';
import { formatZodValidationError } from './zod-validation-error';

describe('formatZodValidationError', () => {
  it('should format field and root validation errors', () => {
    const schema = z
      .object({
        name: z.string().min(1, 'Nome é obrigatório.'),
      })
      .refine(() => false, 'Payload inválido.');

    const result = schema.safeParse({ name: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(formatZodValidationError(result.error)).toEqual({
        message: 'Dados inválidos.',
        errors: [
          {
            field: 'name',
            message: 'Nome é obrigatório.',
          },
          {
            field: 'root',
            message: 'Payload inválido.',
          },
        ],
      });
    }
  });
});
