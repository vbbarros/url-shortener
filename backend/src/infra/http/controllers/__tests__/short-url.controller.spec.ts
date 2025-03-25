import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ShortUrlController } from '../short-url.controller';
import { CreateShortUrlUseCase } from '../../../../domain/usecases/create-short-url.usecase';
import { FindUserUrlsUseCase } from '../../../../domain/usecases/find-user-urls.usecase';
import { AuthenticatedRequest } from '../../types/authenticated-request';
import { CreateShortUrlDto } from '../../../../application/dtos/create-short-url.dto';

describe('ShortUrlController', () => {
  let controller: ShortUrlController;
  let findUserUrlsUseCase: FindUserUrlsUseCase;
  let createShortUrlUseCase: CreateShortUrlUseCase;
  let jwtService: JwtService;

  const mockUrls = [
    {
      id: '1',
      originalUrl: 'https://example.com',
      shortUrl: 'abc123',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      visits: 0
    },
    {
      id: '2',
      originalUrl: 'https://another-example.com',
      shortUrl: 'def456',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      visits: 5
    }
  ];

  const mockFindUserUrlsUseCase = {
    execute: jest.fn()
  };

  const mockJwtService = {
    verifyAsync: jest.fn()
  };

  const mockCreateShortUrlUseCase = {
    execute: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortUrlController],
      providers: [
        {
          provide: FindUserUrlsUseCase,
          useValue: mockFindUserUrlsUseCase
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: CreateShortUrlUseCase,
          useValue: mockCreateShortUrlUseCase
        }
      ],
    }).compile();

    controller = module.get<ShortUrlController>(ShortUrlController);
    findUserUrlsUseCase = module.get<FindUserUrlsUseCase>(FindUserUrlsUseCase);
    createShortUrlUseCase = module.get<CreateShortUrlUseCase>(CreateShortUrlUseCase);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('findUserUrls', () => {
    it('should return an array of user URLs when user is authenticated', async () => {
      const userId = 'user-1';
      const mockRequest = {
        user: { sub: userId }
      } as AuthenticatedRequest;

      mockFindUserUrlsUseCase.execute.mockResolvedValue(mockUrls);

      const result = await controller.findUserUrls(mockRequest);

      expect(result).toEqual(mockUrls);
      expect(findUserUrlsUseCase.execute).toHaveBeenCalledWith(userId);
      expect(findUserUrlsUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when user is not authenticated', async () => {
      const mockRequest = {
        user: null
      } as unknown as AuthenticatedRequest;

      await expect(controller.findUserUrls(mockRequest))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user sub is missing', async () => {
      // Arrange
      const mockRequest = {
        user: { }
      } as AuthenticatedRequest;

      // Act & Assert
      await expect(controller.findUserUrls(mockRequest))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException when FindUserUrlsUseCase throws an error', async () => {
      const userId = 'user-1';
      const mockRequest = {
        user: { sub: userId }
      } as AuthenticatedRequest;

      mockFindUserUrlsUseCase.execute.mockRejectedValue(new Error('User not found'));

      await expect(controller.findUserUrls(mockRequest))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should return empty array when user has no URLs', async () => {
      const userId = 'user-1';
      const mockRequest = {
        user: { sub: userId }
      } as AuthenticatedRequest;

      mockFindUserUrlsUseCase.execute.mockResolvedValue([]);

      const result = await controller.findUserUrls(mockRequest);

      expect(result).toEqual([]);
      expect(findUserUrlsUseCase.execute).toHaveBeenCalledWith(userId);
    });

    it('should preserve UnauthorizedException when thrown by use case', async () => {
      const userId = 'user-1';
      const mockRequest = {
        user: { sub: userId }
      } as AuthenticatedRequest;

      mockFindUserUrlsUseCase.execute.mockRejectedValue(new UnauthorizedException('Custom auth error'));

      await expect(controller.findUserUrls(mockRequest))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('create', () => {
    const mockCreatedUrl = {
      id: 'new-1',
      originalUrl: 'https://example.com',
      shortUrl: 'xyz789',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      visits: 0
    };

    it('should create a short URL for authenticated user', async () => {
      const userId = 'user-1';
      const createDto: CreateShortUrlDto = {
        originalUrl: 'https://example.com',
        customSlug: 'custom123'
      };
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token'
        },
        user: { sub: userId }
      } as unknown as AuthenticatedRequest;

      mockJwtService.verifyAsync.mockResolvedValue({ sub: userId });
      mockCreateShortUrlUseCase.execute.mockResolvedValue(mockCreatedUrl);

      // Act
      const result = await controller.create(createDto, mockRequest);

      // Assert
      expect(result).toEqual(mockCreatedUrl);
      expect(createShortUrlUseCase.execute).toHaveBeenCalledWith({
        ...createDto,
        userId
      });
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
    });

    it('should create a short URL for unauthenticated user', async () => {
      const createDto: CreateShortUrlDto = {
        originalUrl: 'https://example.com'
      };
      const mockRequest = {
        headers: {}
      } as unknown as AuthenticatedRequest;

      const anonymousUrl = { ...mockCreatedUrl, userId: undefined };
      mockCreateShortUrlUseCase.execute.mockResolvedValue(anonymousUrl);

      const result = await controller.create(createDto, mockRequest);

      expect(result).toEqual(anonymousUrl);
      expect(createShortUrlUseCase.execute).toHaveBeenCalledWith({
        ...createDto,
        userId: undefined
      });
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('should handle invalid token gracefully', async () => {
      const createDto: CreateShortUrlDto = {
        originalUrl: 'https://example.com'
      };
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-token'
        }
      } as unknown as AuthenticatedRequest;

      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));
      const anonymousUrl = { ...mockCreatedUrl, userId: undefined };
      mockCreateShortUrlUseCase.execute.mockResolvedValue(anonymousUrl);

      const result = await controller.create(createDto, mockRequest);

      expect(result).toEqual(anonymousUrl);
      expect(createShortUrlUseCase.execute).toHaveBeenCalledWith({
        ...createDto,
        userId: undefined
      });
    });

    it('should throw NotFoundException when URL creation fails', async () => {
      const createDto: CreateShortUrlDto = {
        originalUrl: 'https://example.com'
      };
      const mockRequest = {
        headers: {}
      } as unknown as AuthenticatedRequest;

      mockCreateShortUrlUseCase.execute.mockRejectedValue(new Error('Creation failed'));

      await expect(controller.create(createDto, mockRequest))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should handle custom slug creation', async () => {
      const createDto: CreateShortUrlDto = {
        originalUrl: 'https://example.com',
        customSlug: 'my-custom-slug'
      };
      const mockRequest = {
        headers: {}
      } as unknown as AuthenticatedRequest;

      const customUrl = { ...mockCreatedUrl, shortUrl: 'my-custom-slug' };
      mockCreateShortUrlUseCase.execute.mockResolvedValue(customUrl);

      const result = await controller.create(createDto, mockRequest);

      expect(result).toEqual(customUrl);
      expect(createShortUrlUseCase.execute).toHaveBeenCalledWith({
        ...createDto,
        userId: undefined
      });
    });

    it('should validate authorization header format', async () => {
      const createDto: CreateShortUrlDto = {
        originalUrl: 'https://example.com'
      };
      const mockRequest = {
        headers: {
          authorization: 'InvalidFormat'
        }
      } as unknown as AuthenticatedRequest;

      const anonymousUrl = { ...mockCreatedUrl, userId: undefined };
      mockCreateShortUrlUseCase.execute.mockResolvedValue(anonymousUrl);

      const result = await controller.create(createDto, mockRequest);

      expect(result).toEqual(anonymousUrl);
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
      expect(createShortUrlUseCase.execute).toHaveBeenCalledWith({
        ...createDto,
        userId: undefined
      });
    });
  });
}); 