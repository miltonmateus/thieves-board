import { z } from 'zod';

export const supportedSheetFileMimeTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const;

export const uploadedSheetFileSchema = z.object({
  buffer: z.instanceof(Buffer).refine((buffer) => buffer.length > 0, {
    message: 'O arquivo enviado está vazio.',
  }),
  filename: z.string().trim().min(1).optional(),
  mimetype: z.enum(supportedSheetFileMimeTypes, {
    error: 'O arquivo enviado precisa ser um PDF, JPG ou PNG.',
  }),
});

export type UploadedSheetFile = z.infer<typeof uploadedSheetFileSchema>;
