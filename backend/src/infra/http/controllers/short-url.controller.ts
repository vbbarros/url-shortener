import { Body, Controller, Get, Post, Req, UseGuards, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateShortUrlDto } from '../../../application/dtos/create-short-url.dto';
import { CreateShortUrlUseCase } from '../../../domain/usecases/create-short-url.usecase';
import { FindUserUrlsUseCase } from '../../../domain/usecases/find-user-urls.usecase';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { JwtService } from '@nestjs/jwt';
import { ShortUrl } from '../../../domain/entities/short-url.entity';

@Controller('short-urls')
export class ShortUrlController {
  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly findUserUrlsUseCase: FindUserUrlsUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async create(@Body() createShortUrlDto: CreateShortUrlDto, @Req() req: AuthenticatedRequest): Promise<ShortUrl> {
    try {
      let userId: string | undefined;
      
      if (req.headers.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];
        try {
          const payload = await this.jwtService.verifyAsync(token);
          userId = payload.sub;
        } catch {
          userId = undefined;
        }
      }

      return await this.createShortUrlUseCase.execute({
        ...createShortUrlDto,
        userId,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new NotFoundException(error.message);
      }
      throw new NotFoundException('An unexpected error occurred');
    }
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async findUserUrls(@Req() req: AuthenticatedRequest): Promise<ShortUrl[]> {
    try {
      if (!req.user?.sub) {
        throw new UnauthorizedException('User not authenticated');
      }
      return await this.findUserUrlsUseCase.execute(req.user.sub);
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new NotFoundException(error.message);
      }
      throw new NotFoundException('An unexpected error occurred');
    }
  }
} 