import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IShortUrlRepository, SHORT_URL_REPOSITORY } from '../repositories/short-url.repository';
import { IUserRepository, USER_REPOSITORY } from '../repositories/user.repository';
import { ShortUrl } from '../entities/short-url.entity';

@Injectable()
export class FindUserUrlsUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<ShortUrl[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.shortUrlRepository.findByUserId(userId);
  }
} 