import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../http/controllers/auth.controller';
import { CreateUserUseCase } from '../../domain/usecases/create-user.usecase';
import { AuthenticateUserUseCase } from '../../domain/usecases/authenticate-user.usecase';
import { UserModule } from './user.module';
import { JwtStrategy } from '../http/strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [CreateUserUseCase, AuthenticateUserUseCase, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {} 