import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { HomeController } from '../home.controller';
import { RedirectShortUrlUseCase } from '../../../../domain/usecases/redirect-short-url.usecase';

describe('HomeController', () => {
  let controller: HomeController;
  let redirectShortUrlUseCase: RedirectShortUrlUseCase;

  const mockRedirectShortUrlUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: RedirectShortUrlUseCase,
          useValue: mockRedirectShortUrlUseCase,
        },
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    redirectShortUrlUseCase = module.get<RedirectShortUrlUseCase>(RedirectShortUrlUseCase);

    jest.clearAllMocks();
  });

  describe('healthCheck', () => {
    it('should return health status with timestamp', () => {
      const now = new Date('2024-03-25T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => now);

      const result = controller.healthCheck();

      expect(result).toEqual({
        status: 'ok',
        timestamp: '2024-03-25T12:00:00.000Z',
      });

      jest.restoreAllMocks();
    });

    it('should always return status ok', () => {
      const result = controller.healthCheck();

      expect(result.status).toBe('ok');
    });
  });

  describe('redirect', () => {
    const mockResponse = {
      redirect: jest.fn(),
    } as unknown as Response;

    it('should redirect to original URL when slug is valid', async () => {
      const slug = 'valid-slug';
      const originalUrl = 'https://example.com';
      mockRedirectShortUrlUseCase.execute.mockResolvedValue(originalUrl);

      await controller.redirect(slug, mockResponse);

      expect(redirectShortUrlUseCase.execute).toHaveBeenCalledWith(slug);
      expect(mockResponse.redirect).toHaveBeenCalledWith(originalUrl);
      expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when slug is invalid', async () => {
      const slug = 'invalid-slug';
      mockRedirectShortUrlUseCase.execute.mockRejectedValue(new Error('URL not found'));

      await expect(controller.redirect(slug, mockResponse))
        .rejects
        .toThrow(NotFoundException);
      
      expect(redirectShortUrlUseCase.execute).toHaveBeenCalledWith(slug);
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException with original error message', async () => {
      const slug = 'invalid-slug';
      const errorMessage = 'Custom error message';
      mockRedirectShortUrlUseCase.execute.mockRejectedValue(new Error(errorMessage));

      try {
        await controller.redirect(slug, mockResponse);
        fail('Should have thrown an exception');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(errorMessage);
      }
    });

    it('should handle malformed slugs', async () => {
      const slug = '!@#$%';
      mockRedirectShortUrlUseCase.execute.mockRejectedValue(new Error('Invalid slug format'));

      await expect(controller.redirect(slug, mockResponse))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should pass the exact slug to use case without modification', async () => {
      const slug = 'CaSeSeNsItIvE-123';
      const originalUrl = 'https://example.com';
      mockRedirectShortUrlUseCase.execute.mockResolvedValue(originalUrl);

      await controller.redirect(slug, mockResponse);

      expect(redirectShortUrlUseCase.execute).toHaveBeenCalledWith(slug);
      expect(redirectShortUrlUseCase.execute).toHaveBeenCalledWith(expect.stringMatching(/^CaSeSeNsItIvE-123$/));
    });
  });
}); 