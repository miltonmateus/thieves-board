import { BadRequestException } from '@nestjs/common';
import { fromBuffer } from 'pdf2pic';
import { PdfImageConverterService } from './pdf-image-converter.service';

jest.mock('pdf2pic', () => ({
  fromBuffer: jest.fn(),
}));

describe('PdfImageConverterService', () => {
  const service = new PdfImageConverterService();
  const bulk = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (fromBuffer as jest.Mock).mockReturnValue({ bulk });
  });

  it('should convert pdf pages and return generated image paths', async () => {
    bulk.mockResolvedValue([
      { path: '/tmp/page-1.png' },
      { path: undefined },
      { path: '/tmp/page-2.png' },
    ]);

    await expect(service.convert(Buffer.from('pdf'))).resolves.toEqual([
      '/tmp/page-1.png',
      '/tmp/page-2.png',
    ]);
    expect(fromBuffer).toHaveBeenCalledWith(Buffer.from('pdf'), {
      density: 300,
      format: 'png',
      width: 1200,
      height: 1600,
    });
    expect(bulk).toHaveBeenCalledWith(-1);
  });

  it('should reject when no images are generated', async () => {
    bulk.mockResolvedValue([{ path: undefined }]);

    await expect(service.convert(Buffer.from('pdf'))).rejects.toThrow(
      BadRequestException,
    );
  });
});
