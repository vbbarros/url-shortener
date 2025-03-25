import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindUserUrlsUseCase } from '../find-user-urls.usecase';
import { SHORT_URL_REPOSITORY } from '../../repositories/short-url.repository';
import { USER_REPOSITORY } from '../../repositories/user.repository';

describe('FindUserUrlsUseCase', () => {
  let useCase: FindUserUrlsUseCase;
  let shortUrlRepository: any;
  let userRepository: any;

  const mockUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  const mockUrls = [
    {
      id: 'url-1',
      originalUrl: 'https://example1.com',
      slug: 'abc123',
      userId: 'user-1',
      visits: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'url-2',
      originalUrl: 'https://example2.com',
      slug: 'def456',
      userId: 'user-1',
      visits: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockShortUrlRepository = {
    findByUserId: jest.fn()
  };

  const mockUserRepository = {
    findById: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserUrlsUseCase,
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

    useCase = module.get<FindUserUrlsUseCase>(FindUserUrlsUseCase);
    shortUrlRepository = module.get(SHORT_URL_REPOSITORY);
    userRepository = module.get(USER_REPOSITORY);

    jest.clearAllMocks();
  });

  it('should find all URLs for a user', async () => {
    const userId = 'user-1';

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockShortUrlRepository.findByUserId.mockResolvedValue(mockUrls);

    const result = await useCase.execute(userId);

    expect(result).toEqual(mockUrls);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(shortUrlRepository.findByUserId).toHaveBeenCalledWith(userId);
  });

  it('should return empty array when user has no URLs', async () => {
    const userId = 'user-1';

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockShortUrlRepository.findByUserId.mockResolvedValue([]);

    const result = await useCase.execute(userId);

    expect(result).toEqual([]);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(shortUrlRepository.findByUserId).toHaveBeenCalledWith(userId);
  });

  it('should throw NotFoundException when user is not found', async () => {
    const userId = 'nonexistent-user';

    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(userId))
      .rejects
      .toThrow(NotFoundException);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(shortUrlRepository.findByUserId).not.toHaveBeenCalled();
  });

  it('should handle repository error', async () => {
    const userId = 'user-1';
    const errorMessage = 'Database error';

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockShortUrlRepository.findByUserId.mockRejectedValue(new Error(errorMessage));

    await expect(useCase.execute(userId))
      .rejects
      .toThrow(errorMessage);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(shortUrlRepository.findByUserId).toHaveBeenCalledWith(userId);
  });
}); 