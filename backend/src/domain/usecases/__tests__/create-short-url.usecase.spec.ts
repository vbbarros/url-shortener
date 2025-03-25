import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateShortUrlUseCase } from '../create-short-url.usecase';
import { SHORT_URL_REPOSITORY } from '../../repositories/short-url.repository';
import { USER_REPOSITORY } from '../../repositories/user.repository';
import { nanoid } from 'nanoid';

jest.mock('nanoid');

describe('CreateShortUrlUseCase', () => {
  let useCase: CreateShortUrlUseCase;
  let shortUrlRepository: any;
  let userRepository: any;

  const mockUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com'
  };

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
    create: jest.fn()
  };

  const mockUserRepository = {
    findById: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateShortUrlUseCase,
        {
          provide: SHORT_URL_REPOSITORY,
          useValue: mockShortUrlRepository
        },
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository
        }
      ]
    }).compile();

    useCase = module.get<CreateShortUrlUseCase>(CreateShortUrlUseCase);
    shortUrlRepository = module.get(SHORT_URL_REPOSITORY);
    userRepository = module.get(USER_REPOSITORY);

    jest.clearAllMocks();
  });

  it('should create short URL with custom slug', async () => {
    const params = {
      originalUrl: 'https://example.com',
      customSlug: 'custom123',
      userId: 'user-1'
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockShortUrlRepository.findBySlug.mockResolvedValue(null);
    mockShortUrlRepository.create.mockResolvedValue(mockShortUrl);

    const result = await useCase.execute(params);

    expect(result).toEqual(mockShortUrl);
    expect(userRepository.findById).toHaveBeenCalledWith(params.userId);
    expect(shortUrlRepository.findBySlug).toHaveBeenCalledWith(params.customSlug);
    expect(shortUrlRepository.create).toHaveBeenCalledWith({
      originalUrl: params.originalUrl,
      slug: params.customSlug,
      userId: params.userId,
      visits: 0
    });
  });

  it('should create short URL with generated slug', async () => {
    const params = {
      originalUrl: 'https://example.com',
      userId: 'user-1'
    };

    const generatedSlug = 'gen123';
    (nanoid as jest.Mock).mockReturnValue(generatedSlug);

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockShortUrlRepository.findBySlug.mockResolvedValue(null);
    mockShortUrlRepository.create.mockResolvedValue({
      ...mockShortUrl,
      slug: generatedSlug
    });

    const result = await useCase.execute(params);

    expect(result.slug).toBe(generatedSlug);
    expect(nanoid).toHaveBeenCalledWith(8);
    expect(shortUrlRepository.findBySlug).toHaveBeenCalledWith(generatedSlug);
  });

  it('should create short URL without user', async () => {
    const params = {
      originalUrl: 'https://example.com'
    };

    const generatedSlug = 'gen123';
    (nanoid as jest.Mock).mockReturnValue(generatedSlug);

    mockShortUrlRepository.findBySlug.mockResolvedValue(null);
    mockShortUrlRepository.create.mockResolvedValue({
      ...mockShortUrl,
      userId: undefined
    });

    const result = await useCase.execute(params);

    expect(result.userId).toBeUndefined();
    expect(userRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when user is not found', async () => {
    const params = {
      originalUrl: 'https://example.com',
      userId: 'nonexistent-user'
    };

    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(params))
      .rejects
      .toThrow(NotFoundException);

    expect(userRepository.findById).toHaveBeenCalledWith(params.userId);
    expect(shortUrlRepository.findBySlug).not.toHaveBeenCalled();
    expect(shortUrlRepository.create).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when slug already exists', async () => {
    const params = {
      originalUrl: 'https://example.com',
      customSlug: 'existing-slug'
    };

    mockShortUrlRepository.findBySlug.mockResolvedValue(mockShortUrl);

    await expect(useCase.execute(params))
      .rejects
      .toThrow(BadRequestException);

    expect(shortUrlRepository.findBySlug).toHaveBeenCalledWith(params.customSlug);
    expect(shortUrlRepository.create).not.toHaveBeenCalled();
  });

  it('should handle repository creation failure', async () => {
    const params = {
      originalUrl: 'https://example.com',
      customSlug: 'new-slug'
    };

    mockShortUrlRepository.findBySlug.mockResolvedValue(null);
    mockShortUrlRepository.create.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(params))
      .rejects
      .toThrow('Database error');

    expect(shortUrlRepository.findBySlug).toHaveBeenCalledWith(params.customSlug);
    expect(shortUrlRepository.create).toHaveBeenCalled();
  });
}); 