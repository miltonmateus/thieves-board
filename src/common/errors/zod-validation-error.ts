import type { ZodError } from 'zod';

export function formatZodValidationError(error: ZodError) {
  return {
    message: 'Dados inválidos.',
    errors: error.issues.map((issue) => ({
      field: issue.path.join('.') || 'root',
      message: issue.message,
    })),
  };
}
