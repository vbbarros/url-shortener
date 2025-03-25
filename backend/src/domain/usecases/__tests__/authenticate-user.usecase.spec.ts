import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthenticateUserUseCase } from '../authenticate-user.usecase';
import { USER_REPOSITORY } from '../../repositories/user.repository';

jest.mock('bcrypt');

describe('AuthenticateUserUseCase', () => {
  let useCase: AuthenticateUserUseCase;
  let userRepository: any;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockUserRepository = {
    findByEmail: jest.fn()
  };

  const mockJwtService = {
    sign: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ]
    }).compile();

    useCase = module.get<AuthenticateUserUseCase>(AuthenticateUserUseCase);
    userRepository = module.get(USER_REPOSITORY);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
  });

  it('should authenticate user successfully', async () => {
    const params = {
      email: 'john@example.com',
      password: 'password123'
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign.mockReturnValue('jwt_token');

    const result = await useCase.execute(params);

    expect(result).toEqual({
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email
      },
      token: 'jwt_token'
    });
    expect(userRepository.findByEmail).toHaveBeenCalledWith(params.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(params.password, mockUser.password);
    expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    const params = {
      email: 'nonexistent@example.com',
      password: 'password123'
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(params))
      .rejects
      .toThrow(UnauthorizedException);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(params.email);
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    const params = {
      email: 'john@example.com',
      password: 'wrong_password'
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(useCase.execute(params))
      .rejects
      .toThrow(UnauthorizedException);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(params.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(params.password, mockUser.password);
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('should handle bcrypt compare failure', async () => {
    const params = {
      email: 'john@example.com',
      password: 'password123'
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('Bcrypt error'));

    await expect(useCase.execute(params))
      .rejects
      .toThrow('Bcrypt error');

    expect(userRepository.findByEmail).toHaveBeenCalledWith(params.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(params.password, mockUser.password);
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('should handle jwt sign failure', async () => {
    const params = {
      email: 'john@example.com',
      password: 'password123'
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign.mockImplementation(() => {
      throw new Error('JWT error');
    });

    await expect(useCase.execute(params))
      .rejects
      .toThrow('JWT error');

    expect(userRepository.findByEmail).toHaveBeenCalledWith(params.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(params.password, mockUser.password);
    expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
  });
}); 