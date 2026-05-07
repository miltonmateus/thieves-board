import {
  supportedSheetFileMimeTypes,
  uploadedSheetFileSchema,
} from './uploaded-sheet-file.schema';

describe('uploadedSheetFileSchema', () => {
  it('should accept non-empty buffers with supported mime types', () => {
    expect(
      uploadedSheetFileSchema.parse({
        buffer: Buffer.from('file'),
        filename: ' ficha.pdf ',
        mimetype: supportedSheetFileMimeTypes[0],
      }),
    ).toEqual({
      buffer: Buffer.from('file'),
      filename: 'ficha.pdf',
      mimetype: supportedSheetFileMimeTypes[0],
    });
  });

  it('should reject empty buffers and unsupported mime types', () => {
    expect(
      uploadedSheetFileSchema.safeParse({
        buffer: Buffer.alloc(0),
        mimetype: supportedSheetFileMimeTypes[0],
      }).success,
    ).toBe(false);
    expect(
      uploadedSheetFileSchema.safeParse({
        buffer: Buffer.from('file'),
        mimetype: 'text/plain',
      }).success,
    ).toBe(false);
  });
});
