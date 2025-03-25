import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RedirectShortUrlUseCase } from '../redirect-short-url.usecase';
import { SHORT_URL_REPOSITORY } from '../../repositories/short-url.repository';

describe('RedirectShortUrlUseCase', () => {
  let useCase: RedirectShortUrlUseCase;
  let shortUrlRepository: any;

  const mockShortUrl = {
    id: 'url-1',
    originalUrl: 'https://example.com',
    slug: 'abc123',
    userId: 'user-1',
    visits: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockShortUrlRepository = {
    findBySlug: jest.fn(),
    incrementVisits: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedirectShortUrlUseCase,
        {
          provide: SHORT_URL_REPOSITORY,
          useValue: mockShortUrlRepository
        }
      ]
    }).compile();

    useCase = module.get<RedirectShortUrlUseCase>(RedirectShortUrlUseCase);
    shortUrlRepository = module.get(SHORT_URL_REPOSITORY);

    jest.clearAllMocks();
  });

  it('should return original URL and increment visits', async () => {
    const slug = 'abc123';
    const updatedShortUrl = { ...mockShortUrl, visits: 1 };

    mockShortUrlRepository.findBySlug.mockResolvedValue(mockShortUrl);
    mockShortUrlRepository.incrementVisits.mockResolvedValue(updatedShortUrl);

    const result = await useCase.execute(slug);

    expect(result).toBe(mockShortUrl.originalUrl);
    expect(shortUrlRepository.findBySlug).toHaveBeenCalledWith(slug);
    expect(shortUrlRepository.incrementVisits).toHaveBeenCalledWith(mockShortUrl.id);
  });

  it('should throw NotFoundException when URL is not found', async () => {
    const slug = 'nonexistent';

    mockShortUrlRepository.findBySlug.mockResolvedValue(null);

    await expect(useCase.execute(slug))
      .rejects
      .toThrow(NotFoundException);

    expect(shortUrlRepository.findBySlug).toHaveBeenCalledWith(slug);
    expect(shortUrlRepository.incrementVisits).not.toHaveBeenCalled();
  });

  it('should handle repository findBySlug error', async () => {
    const slug = 'abc123';
    const errorMessage = 'Database error';

    mockShortUrlRepository.findBySlug.mockRejectedValue(new Error(errorMessage));

    await expect(useCase.execute(slug))
      .rejects
      .toThrow(errorMessage);

    expect(shortUrlRepository.findBySlug).toHaveBeenCalledWith(slug);
    expect(shortUrlRepository.incrementVisits).not.toHaveBeenCalled();
  });

  it('should handle case-sensitive slug matching', async () => {
    const slug = 'ABC123';

    mockShortUrlRepository.findBySlug.mockResolvedValue(null);

    await expect(useCase.execute(slug))
      .rejects
      .toThrow(NotFoundException);

    expect(shortUrlRepository.findBySlug).toHaveBeenCalledWith(slug);
    expect(shortUrlRepository.incrementVisits).not.toHaveBeenCalled();
  });
}); 