import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { RedirectShortUrlUseCase } from '../../../domain/usecases/redirect-short-url.usecase';

@Controller()
export class AppController {
  constructor(
    private readonly redirectShortUrlUseCase: RedirectShortUrlUseCase,
  ) {}

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() response: Response) {
    try {
      const originalUrl = await this.redirectShortUrlUseCase.execute(slug);
      return response.redirect(originalUrl);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
} 