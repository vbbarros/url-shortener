import { Module } from '@nestjs/common';
import { CreateUserUseCase } from '../../domain/usecases/create-user.usecase';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { PrismaUserRepository } from '../database/prisma/repositories/prisma-user.repository';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [CreateUserUseCase, USER_REPOSITORY],
})
export class UserModule {} 