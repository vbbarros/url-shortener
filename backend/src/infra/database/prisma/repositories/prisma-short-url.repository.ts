import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IShortUrlRepository } from '../../../../domain/repositories/short-url.repository';
import { ShortUrl } from '../../../../domain/entities/short-url.entity';

@Injectable()
export class PrismaShortUrlRepository implements IShortUrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(shortUrl: Omit<ShortUrl, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShortUrl> {
    const created = await this.prisma.shortUrl.create({
      data: shortUrl,
    });

    return {
      ...created,
      userId: created.userId || undefined,
    };
  }

  async findBySlug(slug: string): Promise<ShortUrl | null> {
    const found = await this.prisma.shortUrl.findUnique({
      where: { slug },
    });

    if (!found) return null;

    return {
      ...found,
      userId: found.userId || undefined,
    };
  }

  async findByUserId(userId: string): Promise<ShortUrl[]> {
    const urls = await this.prisma.shortUrl.findMany({
      where: { userId },
    });

    return urls.map((url: { id: string; originalUrl: string; slug: string; userId: string | null; visits: number; createdAt: Date; updatedAt: Date }) => ({
      id: url.id,
      originalUrl: url.originalUrl,
      slug: url.slug,
      userId: url.userId || undefined,
      visits: url.visits,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    }));
  }

  async incrementVisits(id: string): Promise<void> {
    await this.prisma.shortUrl.update({
      where: { id },
      data: {
        visits: {
          increment: 1,
        },
      },
    });
  }
} 