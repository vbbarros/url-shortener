import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IShortUrlRepository, SHORT_URL_REPOSITORY } from '../repositories/short-url.repository';

@Injectable()
export class RedirectShortUrlUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  async execute(slug: string): Promise<string> {
    const shortUrl = await this.shortUrlRepository.findBySlug(slug);

    if (!shortUrl) {
      throw new NotFoundException('URL not found');
    }

    await this.shortUrlRepository.incrementVisits(shortUrl.id);

    return shortUrl.originalUrl;
  }
} 