import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { PrismaShortUrlRepository } from '../prisma-short-url.repository';
import { ShortUrl } from '../../../../../domain/entities/short-url.entity';

describe('PrismaShortUrlRepository', () => {
  let repository: PrismaShortUrlRepository;
  let prismaService: PrismaService;

  const mockShortUrl: ShortUrl = {
    id: 'url-1',
    originalUrl: 'https://example.com',
    slug: 'abc123',
    userId: 'user-1',
    visits: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    shortUrl: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaShortUrlRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PrismaShortUrlRepository>(PrismaShortUrlRepository);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new short URL', async () => {
      const createUrlData = {
        originalUrl: mockShortUrl.originalUrl,
        slug: mockShortUrl.slug,
        userId: mockShortUrl.userId,
        visits: 0,
      };

      mockPrismaService.shortUrl.create.mockResolvedValue(mockShortUrl);

      const result = await repository.create(createUrlData);

      expect(result).toEqual(mockShortUrl);
      expect(prismaService.shortUrl.create).toHaveBeenCalledWith({
        data: createUrlData,
      });
    });

    it('should handle null userId during creation', async () => {
      const createUrlData = {
        originalUrl: mockShortUrl.originalUrl,
        slug: mockShortUrl.slug,
        visits: 0,
      };

      const mockResponse = { ...mockShortUrl, userId: null };
      mockPrismaService.shortUrl.create.mockResolvedValue(mockResponse);

      const result = await repository.create(createUrlData);

      expect(result.userId).toBeUndefined();
      expect(prismaService.shortUrl.create).toHaveBeenCalledWith({
        data: createUrlData,
      });
    });

    it('should handle database errors during creation', async () => {
      const createUrlData = {
        originalUrl: mockShortUrl.originalUrl,
        slug: mockShortUrl.slug,
        userId: mockShortUrl.userId,
        visits: 0,
      };

      const error = new Error('Database error');
      mockPrismaService.shortUrl.create.mockRejectedValue(error);

      await expect(repository.create(createUrlData)).rejects.toThrow(error);
      expect(prismaService.shortUrl.create).toHaveBeenCalledWith({
        data: createUrlData,
      });
    });
  });

  describe('findBySlug', () => {
    it('should find a short URL by slug', async () => {
      mockPrismaService.shortUrl.findUnique.mockResolvedValue(mockShortUrl);

      const result = await repository.findBySlug(mockShortUrl.slug);

      expect(result).toEqual(mockShortUrl);
      expect(prismaService.shortUrl.findUnique).toHaveBeenCalledWith({
        where: { slug: mockShortUrl.slug },
      });
    });

    it('should return null when URL is not found', async () => {
      mockPrismaService.shortUrl.findUnique.mockResolvedValue(null);

      const result = await repository.findBySlug('nonexistent');

      expect(result).toBeNull();
      expect(prismaService.shortUrl.findUnique).toHaveBeenCalledWith({
        where: { slug: 'nonexistent' },
      });
    });

    it('should handle null userId in response', async () => {
      const mockResponseWithNullUserId = { ...mockShortUrl, userId: null };
      mockPrismaService.shortUrl.findUnique.mockResolvedValue(mockResponseWithNullUserId);

      const result = await repository.findBySlug(mockShortUrl.slug);

      expect(result?.userId).toBeUndefined();
      expect(prismaService.shortUrl.findUnique).toHaveBeenCalledWith({
        where: { slug: mockShortUrl.slug },
      });
    });

    it('should handle database errors during slug search', async () => {
      const error = new Error('Database error');
      mockPrismaService.shortUrl.findUnique.mockRejectedValue(error);

      await expect(repository.findBySlug(mockShortUrl.slug)).rejects.toThrow(error);
      expect(prismaService.shortUrl.findUnique).toHaveBeenCalledWith({
        where: { slug: mockShortUrl.slug },
      });
    });
  });

  describe('findByUserId', () => {
    it('should find all URLs for a user', async () => {
      const mockUrls = [mockShortUrl, { ...mockShortUrl, id: 'url-2', slug: 'def456' }];
      mockPrismaService.shortUrl.findMany.mockResolvedValue(mockUrls);

      const result = await repository.findByUserId(mockShortUrl.userId!);

      expect(result).toEqual(mockUrls);
      expect(prismaService.shortUrl.findMany).toHaveBeenCalledWith({
        where: { userId: mockShortUrl.userId },
      });
    });

    it('should return empty array when user has no URLs', async () => {
      mockPrismaService.shortUrl.findMany.mockResolvedValue([]);

      const result = await repository.findByUserId('user-without-urls');

      expect(result).toEqual([]);
      expect(prismaService.shortUrl.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-without-urls' },
      });
    });

    it('should handle null userId in response items', async () => {
      const mockUrlsWithNullUserId = [
        { ...mockShortUrl, userId: null },
        { ...mockShortUrl, id: 'url-2', slug: 'def456', userId: null },
      ];
      mockPrismaService.shortUrl.findMany.mockResolvedValue(mockUrlsWithNullUserId);

      const result = await repository.findByUserId('some-user-id');

      expect(result.every(url => url.userId === undefined)).toBe(true);
      expect(prismaService.shortUrl.findMany).toHaveBeenCalledWith({
        where: { userId: 'some-user-id' },
      });
    });

    it('should handle database errors during user URLs search', async () => {
      const error = new Error('Database error');
      mockPrismaService.shortUrl.findMany.mockRejectedValue(error);

      await expect(repository.findByUserId(mockShortUrl.userId!)).rejects.toThrow(error);
      expect(prismaService.shortUrl.findMany).toHaveBeenCalledWith({
        where: { userId: mockShortUrl.userId },
      });
    });
  });

  describe('incrementVisits', () => {
    it('should increment visits count', async () => {
      mockPrismaService.shortUrl.update.mockResolvedValue({ ...mockShortUrl, visits: 1 });

      await repository.incrementVisits(mockShortUrl.id);

      expect(prismaService.shortUrl.update).toHaveBeenCalledWith({
        where: { id: mockShortUrl.id },
        data: {
          visits: {
            increment: 1,
          },
        },
      });
    });

    it('should handle database errors during visit increment', async () => {
      const error = new Error('Database error');
      mockPrismaService.shortUrl.update.mockRejectedValue(error);

      await expect(repository.incrementVisits(mockShortUrl.id)).rejects.toThrow(error);
      expect(prismaService.shortUrl.update).toHaveBeenCalledWith({
        where: { id: mockShortUrl.id },
        data: {
          visits: {
            increment: 1,
          },
        },
      });
    });
  });
}); 