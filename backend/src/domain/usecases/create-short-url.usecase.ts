import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { IShortUrlRepository, SHORT_URL_REPOSITORY } from '../repositories/short-url.repository';
import { ShortUrl } from '../entities/short-url.entity';
import { IUserRepository, USER_REPOSITORY } from '../repositories/user.repository';

interface CreateShortUrlParams {
  originalUrl: string;
  customSlug?: string;
  userId?: string;
}

@Injectable()
export class CreateShortUrlUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: CreateShortUrlParams): Promise<ShortUrl> {
    if (params.userId) {
      const user = await this.userRepository.findById(params.userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    const slug = params.customSlug || nanoid(8);

    const existingUrl = await this.shortUrlRepository.findBySlug(slug);

    if (existingUrl) {
      throw new BadRequestException('Slug already exists');
    }

    return this.shortUrlRepository.create({
      originalUrl: params.originalUrl,
      slug,
      userId: params.userId,
      visits: 0,
    });
  }
}