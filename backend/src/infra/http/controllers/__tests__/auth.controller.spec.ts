import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from '../auth.controller';
import { CreateUserUseCase } from '../../../../domain/usecases/create-user.usecase';
import { AuthenticateUserUseCase } from '../../../../domain/usecases/authenticate-user.usecase';
import { CreateUserDto } from '../../../../application/dtos/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let createUserUseCase: CreateUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password'
  };

  const mockAuthResult = {
    user: {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email
    },
    token: 'jwt_token'
  };

  const mockCreateUserUseCase = {
    execute: jest.fn()
  };

  const mockAuthenticateUserUseCase = {
    execute: jest.fn()
  };

  const mockJwtService = {
    sign: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase
        },
        {
          provide: AuthenticateUserUseCase,
          useValue: mockAuthenticateUserUseCase
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    authenticateUserUseCase = module.get<AuthenticateUserUseCase>(AuthenticateUserUseCase);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return auth result', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      mockCreateUserUseCase.execute.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await controller.register(createUserDto);

      expect(result).toEqual(mockAuthResult);
      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
    });

    it('should throw UnauthorizedException when registration fails', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      mockCreateUserUseCase.execute.mockRejectedValue(new Error('Email already exists'));

      await expect(controller.register(createUserDto))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should preserve error message in UnauthorizedException', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const errorMessage = 'Email already exists';
      mockCreateUserUseCase.execute.mockRejectedValue(new Error(errorMessage));

      try {
        await controller.register(createUserDto);
        fail('Should have thrown an exception');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('login', () => {
    it('should authenticate user and return auth result', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'password123'
      };

      mockAuthenticateUserUseCase.execute.mockResolvedValue(mockAuthResult);

      const result = await controller.login(credentials);

      expect(result).toEqual(mockAuthResult);
      expect(authenticateUserUseCase.execute).toHaveBeenCalledWith(credentials);
    });

    it('should throw UnauthorizedException when login fails', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'wrong_password'
      };

      mockAuthenticateUserUseCase.execute.mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.login(credentials))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should preserve error message in UnauthorizedException for login', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'wrong_password'
      };

      const errorMessage = 'Invalid credentials';
      mockAuthenticateUserUseCase.execute.mockRejectedValue(new Error(errorMessage));

      try {
        await controller.login(credentials);
        fail('Should have thrown an exception');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe(errorMessage);
      }
    });

    it('should handle non-existent user login attempt', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      mockAuthenticateUserUseCase.execute.mockRejectedValue(new Error('User not found'));

      await expect(controller.login(credentials))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
}); 