import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../../../application/dtos/create-user.dto';
import { AuthResultDto } from '../../../application/dtos/auth-result.dto';
import { CreateUserUseCase } from '../../../domain/usecases/create-user.usecase';
import { AuthenticateUserUseCase } from '../../../domain/usecases/authenticate-user.usecase';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResultDto> {
    try {
      const user = await this.createUserUseCase.execute(createUserDto);
      const token = this.jwtService.sign({ sub: user.id });

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException('An unexpected error occurred');
    }
  }

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }): Promise<AuthResultDto> {
    try {
      return await this.authenticateUserUseCase.execute(credentials);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException('An unexpected error occurred');
    }
  }
} 