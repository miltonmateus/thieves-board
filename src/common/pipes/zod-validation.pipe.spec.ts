import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  it('should return parsed data when payload is valid', () => {
    const pipe = new ZodValidationPipe(
      z.object({
        name: z.string().trim(),
        quantity: z.number().default(1),
      }),
    );

    expect(pipe.transform({ name: ' Arkon ' })).toEqual({
      name: 'Arkon',
      quantity: 1,
    });
  });

  it('should throw a bad request with formatted zod errors', () => {
    const pipe = new ZodValidationPipe(
      z.object({
        name: z.string().min(1, 'Nome é obrigatório.'),
      }),
    );

    expect(() => pipe.transform({ name: '' })).toThrow(BadRequestException);

    try {
      pipe.transform({ name: '' });
    } catch (error) {
      expect((error as BadRequestException).getResponse()).toEqual({
        message: 'Dados inválidos.',
        errors: [
          {
            field: 'name',
            message: 'Nome é obrigatório.',
          },
        ],
      });
    }
  });
});
