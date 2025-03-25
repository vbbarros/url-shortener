import { ShortUrl } from '../entities/short-url.entity';

export const SHORT_URL_REPOSITORY = 'SHORT_URL_REPOSITORY';

export interface IShortUrlRepository {
  create(shortUrl: Omit<ShortUrl, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShortUrl>;
  findBySlug(slug: string): Promise<ShortUrl | null>;
  findByUserId(userId: string): Promise<ShortUrl[]>;
  incrementVisits(id: string): Promise<void>;
} 