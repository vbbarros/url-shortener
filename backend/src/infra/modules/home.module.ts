import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CreateShortUrlUseCase } from '../../domain/usecases/create-short-url.usecase';
import { RedirectShortUrlUseCase } from '../../domain/usecases/redirect-short-url.usecase';
import { FindUserUrlsUseCase } from '../../domain/usecases/find-user-urls.usecase';
import { SHORT_URL_REPOSITORY } from '../../domain/repositories/short-url.repository';
import { PrismaShortUrlRepository } from '../database/prisma/repositories/prisma-short-url.repository';
import { PrismaModule } from './prisma.module';
import { ShortUrlController } from '../http/controllers/short-url.controller';
import { UserModule } from './user.module';
import { HomeController } from '../http/controllers/home.controller';

@Module({
  imports: [
    PrismaModule,
    UserModule,
  ],
  controllers: [HomeController],
  providers: [
    RedirectShortUrlUseCase,
    {
      provide: SHORT_URL_REPOSITORY,
      useClass: PrismaShortUrlRepository,
    },
  ],
  exports: [RedirectShortUrlUseCase, SHORT_URL_REPOSITORY],
})
export class HomeModule {} 